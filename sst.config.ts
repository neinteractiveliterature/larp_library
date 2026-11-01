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

    // Production's bucket already exists (and is managed by neil-terraform, including its CORS rules), so it's imported
    // rather than created.  Other stages get a bucket of their own.
    const uploadsBucket =
      $app.stage === 'production'
        ? sst.aws.Bucket.get('Uploads', 'larp-library-production')
        : new sst.aws.Bucket('Uploads', { access: 'public' });

    // The full set of environment variables every Lambda that runs app code boots with (the web function, the migrator,
    // and later the job handlers). Each of them imports app/javascript/server/env.ts, which validates all of it, so a
    // function given only the variables it "currently uses" would break the day its code reaches a module that wants
    // another one.
    const appEnvironment = {
      DATABASE_URL: databaseUrl.value,
      AWS_S3_BUCKET: uploadsBucket.name,
      APP_URL_BASE: $app.stage === 'production' ? 'https://www.larplibrary.org' : 'http://localhost:3042',
      NODE_EXTRA_CA_CERTS: '/var/task/rds-global-bundle.pem',
    };

    // Runs every pending Drizzle migration before the web function is deployed (and, since the web function will
    // depend on this invocation, before it starts serving the new code).
    const migrator = new sst.aws.Function('MigratorFn', {
      handler: 'app/javascript/server/handlers/migrate.handler',
      copyFiles: COPY_FILES,
      timeout: '10 minutes',
      environment: appEnvironment,
      runtime: 'nodejs22.x',
    });
    new aws.lambda.Invocation('MigratorInvocation', {
      functionName: migrator.name,
      input: JSON.stringify({ now: new Date().toISOString() }),
    });
  },
});
