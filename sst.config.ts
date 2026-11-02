/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

// Everything lives in us-east-1 (the production RDS instance, the uploads bucket and the Lambdas), in the NEIL AWS
// account. The infrastructure this deploys into (the GitHub OIDC deploy role, the production database role, the
// Cloudflare zone) is managed in the neil-terraform repo.

// The production RDS instance forces SSL, and Node doesn't trust RDS's CA by default. Every Lambda that talks to the
// database gets the CA bundle copied in and pointed at by NODE_EXTRA_CA_CERTS (which Node reads at process start).
const RDS_CA_BUNDLE = { from: 'rds-global-bundle.pem', to: './rds-global-bundle.pem' };
const COPY_FILES = [{ from: 'drizzle', to: './drizzle' }, RDS_CA_BUNDLE];

export default $config({
  app(input) {
    return {
      name: 'larp-library',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: { region: 'us-east-1' },
      },
    };
  },
  async run() {
    const databaseUrl = new sst.Secret('DATABASE_URL');
    const betterAuthSecret = new sst.Secret('BETTER_AUTH_SECRET');
    // This app's registered OAuth application on Intercode
    const intercodeAppId = new sst.Secret('INTERCODE_APP_ID');
    const intercodeAppSecret = new sst.Secret('INTERCODE_APP_SECRET');

    // Production's bucket already exists (and is managed by neil-terraform, including its CORS rules), so it's imported
    // rather than created.  Other stages get a bucket of their own.
    const uploadsBucket =
      $app.stage === 'production'
        ? sst.aws.Bucket.get('Uploads', 'larp-library-production')
        : new sst.aws.Bucket('Uploads', { access: 'public' });

    const sentryRelease = process.env['SENTRY_RELEASE'] ?? process.env['GITHUB_SHA'];

    // The full set of environment variables every Lambda that runs app code boots with (the web function, the migrator,
    // and later the job handlers). Each of them imports app/server/env.ts, which validates all of it, so a
    // function given only the variables it "currently uses" would break the day its code reaches a module that wants
    // another one.
    const appEnvironment = {
      DATABASE_URL: databaseUrl.value,
      BETTER_AUTH_SECRET: betterAuthSecret.value,
      INTERCODE_URL: 'https://www.neilhosting.net',
      // Not a secret: it ships to the browser
      SENTRY_DSN: 'https://29f53aa57e6984c5f905eb0dad4630a4@o4506357087076352.ingest.us.sentry.io/4512023434166272',
      INTERCODE_APP_ID: intercodeAppId.value,
      INTERCODE_APP_SECRET: intercodeAppSecret.value,
      AWS_S3_BUCKET: uploadsBucket.name,
      APP_URL_BASE: $app.stage === 'production' ? 'https://www.larplibrary.org' : 'http://localhost:3042',
      NODE_EXTRA_CA_CERTS: '/var/task/rds-global-bundle.pem',
      // Read by the Sentry SDK itself, which otherwise tags every event as the default environment, with no release
      SENTRY_ENVIRONMENT: $app.stage,
      ...(sentryRelease ? { SENTRY_RELEASE: sentryRelease } : {}),
    };

    // Runs every pending Drizzle migration before the web function is deployed (and, since the web function depends on this
    // invocation, before it starts serving the new code).
    const migrator = new sst.aws.Function('MigratorFn', {
      handler: 'app/server/handlers/migrate.handler',
      copyFiles: COPY_FILES,
      timeout: '10 minutes',
      environment: appEnvironment,
      runtime: 'nodejs22.x',
    });
    const migratorInvocation = new aws.lambda.Invocation('MigratorInvocation', {
      functionName: migrator.name,
      input: JSON.stringify({ now: new Date().toISOString() }),
    });

    new sst.aws.React(
      'LarpLibrary',
      {
        buildCommand: 'yarn build',
        // Without this, files that drop out of the build linger in the bucket, and in CloudFront's routing, serving stale
        // content for those paths after the code no longer produces them.
        assets: { purge: true },
        // Gives the web function access to the uploads bucket: presigning uploads, checking they arrived, deleting files
        link: [uploadsBucket],
        permissions: [
          // Sending the brand emails through SES (larplibrary.org is a verified SES identity, managed in neil-terraform)
          { actions: ['ses:SendEmail', 'ses:SendRawEmail'], resources: ['*'] },
        ],
        domain:
          $app.stage === 'production'
            ? {
                name: 'www.larplibrary.org',
                dns: sst.cloudflare.dns(),
                // The apex (larplibrary.org) already redirects to www, through neil-terraform's Cloudflare setup
                redirects: ['library.interactiveliterature.org'],
              }
            : undefined,
        environment: appEnvironment,
        server: {
          runtime: 'nodejs22.x',
          architecture: 'arm64',
          memory: '1024 MB',
          timeout: '20 seconds',
        },
        transform: {
          server(args) {
            const existing = Array.isArray(args.copyFiles) ? args.copyFiles : [];
            args.copyFiles = [...existing, ...COPY_FILES];
          },
        },
      },
      { dependsOn: [migratorInvocation] },
    );
  },
});
