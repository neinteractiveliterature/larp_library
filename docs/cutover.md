# Cutting over from the Rails app on Fly to the SST deployment

This is the order to do it in. Steps 1–5 change nothing the running site depends on; step 6 is the only one that interrupts it.

The infrastructure changes are in the [neil-terraform](https://github.com/neinteractiveliterature/neil-terraform) repository, on the
branch `larp-library-sst-deploy` (additive, safe to apply any time) plus two patches for the steps that come at and after the
cutover (see steps 1, 6 and 8).

## Before the cutover

1. **neil-terraform: the deploy role.** Commit and apply `larp-library-sst-deploy`. It creates the `larp-library-deploy` role and the
   `AWS_OIDC_ROLE`, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets on this repository, adds its Sentry secrets, and
   grants the `larp_library_production` database role CREATE on its database (the migrator runs `CREATE SCHEMA IF NOT EXISTS
drizzle`). Check the secrets appear under the repository's Settings → Secrets.

2. **Find the production credentials.** The Rails app has them as Fly secrets, which can't be listed but can be read from a running
   machine: `fly ssh console -a larp-library -C 'printenv DATABASE_URL INTERCODE_APP_ID INTERCODE_APP_SECRET'`.

3. **Set the SST secrets** (with an AWS profile that can reach the `sst-state` bucket, e.g. `AWS_PROFILE=neil`):

   ```sh
   yarn sst secret set --stage production DATABASE_URL 'postgres://larp_library_production:...@<rds host>/larp_library_production?sslmode=require'
   yarn sst secret set --stage production BETTER_AUTH_SECRET "$(openssl rand -base64 48)"
   yarn sst secret set --stage production INTERCODE_APP_ID '...'
   yarn sst secret set --stage production INTERCODE_APP_SECRET '...'
   ```

   (`?sslmode=require` is needed because the instance forces SSL; the deployed functions trust the RDS CA through
   `NODE_EXTRA_CA_CERTS`.)

4. **Intercode: add the new redirect URI.** The existing OAuth application the Rails app signs in with can be reused: in Intercode's
   OAuth applications admin, add `https://www.larplibrary.org/api/auth/callback/intercode` to its redirect URIs (one per line),
   keeping the old one so the Rails app keeps working until the DNS moves.

5. **Record the baseline migration** in the production database, once (it's harmless to repeat):

   ```sh
   NODE_EXTRA_CA_CERTS=./rds-global-bundle.pem DATABASE_URL='...?sslmode=require' yarn tsx scripts/mark-baseline-applied.ts
   ```

   Without this the first deploy's migrator fails on "relation already exists" (the deploy then stops before the web function
   changes, so nothing breaks, but it has to be fixed to go on).

   The migrations that follow only add things (the sign-in tables, a `name` column with a default, defaults for the timestamp
   columns), so the Rails app keeps working against the database until the DNS moves.

Merge `rr-backend-port` to `main` before the next step: the release workflow deploys what the release was made from.

## The cutover

6. **Move the DNS and deploy.** SST can't take over a DNS record that already exists, so the CNAMEs to `larp-library.fly.dev` have
   to go first, and the site is down from then until the new deployment is serving. Choose a quiet time, and have step 6b ready to
   start the moment 6a finishes:

   a. In neil-terraform, apply `01-release-larp-library-dns.patch`, which destroys exactly two records: the CNAMEs for
   `www.larplibrary.org` and `library.interactiveliterature.org`.

   b. Publish a release (or run the Release workflow by hand). It deploys the stage `production`: the migrator Lambda runs the
   remaining migrations, then the web function, CloudFront distribution and certificate are created and the DNS records written.
   Expect 10–20 minutes, most of it ACM validating the certificate and CloudFront creating its distribution.

7. **Check it** at <https://www.larplibrary.org>:
   - the home page, search and a brand and project page load, and <https://library.interactiveliterature.org> redirects to them;
   - **sign in** through Intercode, and the account is the one you had (matched by Intercode user id), with your brands;
   - **upload a file** to a project you can edit, and download it. This is the one thing no test could cover: it exercises the
     bucket's ACL setting and CORS rules with the presigned upload;
   - **invite someone** to a brand you administer, and check the email arrives (it goes through SES);
   - look through the Larp Library project in Sentry for anything unexpected.

## After

8. **Clean up**, once you're sure you won't go back: apply `02-remove-larp-library-fly-leftovers.patch` in neil-terraform (the
   `assets.larplibrary.org` CloudFront distribution, which only proxied the Rails app, the Fly API token secret, and the Rails-era
   Sentry release token output), then `fly apps destroy larp-library`.

## If it goes wrong

Before step 6 there's nothing to undo. After it, the Fly app is still running, so going back is: revert the DNS patch in
neil-terraform (re-creating the two CNAMEs) after removing the SST-created records. The database works for either app, with one
caveat: anyone who first signed in on the new app has no `provider`/`uid` on their `users` row, so the Rails app would treat them
as new.

## Known gaps

- Server-side source maps aren't uploaded to Sentry, so stack traces from the deployed function show bundled line numbers.
- Nothing runs background jobs; emails are sent while the request is handled (a failure is logged, not retried).
