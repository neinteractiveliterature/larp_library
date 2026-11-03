# Cutting over from the Rails app on Fly to the SST deployment

This is the order to do it in. Steps 1–7 change nothing the running site depends on; step 8 is the only one that interrupts it.

The infrastructure changes are in the [neil-terraform](https://github.com/neinteractiveliterature/neil-terraform) repository, on the
branch `larp-library-sst-deploy` (additive, safe to apply any time) plus two patches for the steps that come at and after the
cutover (see steps 1, 8 and 10).

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

5. **Take an RDS snapshot** of the production instance, named for what it's for (`larp-library-before-port`). It's the way back from
   anything that goes wrong with the data, and the rehearsal in step 7 starts from it. Wait until it's available.

6. **Record the baseline migration** in the production database, once (it's harmless to repeat):

   ```sh
   NODE_EXTRA_CA_CERTS=./rds-global-bundle.pem DATABASE_URL='...?sslmode=require' yarn tsx scripts/mark-baseline-applied.ts
   ```

   Without this the first deploy's migrator fails on "relation already exists" (the deploy then stops before the web function
   changes, so nothing breaks, but it has to be fixed to go on).

   **Don't run the migrations that follow ahead of time**, though they only add things (the sign-in tables, a `name` column with a
   default, defaults for the timestamp columns), so the Rails app would keep working. The migration that creates the sign-in
   accounts (`0001_auth`) copies each user's Intercode id from `users` once, when it runs; anyone who first signed in on Rails after
   that would have no account row, and the new app would give them a second, empty user. Run it at the cutover, when Rails has stopped
   serving, and find out whether it works on production's data with the rehearsal instead.

7. **Rehearse on a copy of production** (recommended). It checks, without any downtime, the things that can't be tested here: that the
   deployed functions can reach RDS over SSL, that the migrations work on production's real data, and that signing in works through
   CloudFront.

   a. **Restore the snapshot from step 5 as a temporary instance** (say `larp-library-rehearsal`), in the same subnet group and with
   the same security group as production, publicly accessible so the Lambdas (which aren't in a VPC) can reach it. Its roles and data
   are production's, so the production database URL works with the new host name.

   b. **Record the baseline in the copy**, as in step 6 but with the copy's URL.

   c. **Deploy a stage called `staging` against the copy.** Any stage but `production` gets its own uploads bucket and no domain:

   ```sh
   yarn sst secret set --stage staging DATABASE_URL 'postgres://larp_library_production:...@<copy host>/larp_library_production?sslmode=require'
   yarn sst secret set --stage staging BETTER_AUTH_SECRET "$(openssl rand -base64 48)"
   yarn sst secret set --stage staging INTERCODE_APP_ID '...'      # the same OAuth application as production
   yarn sst secret set --stage staging INTERCODE_APP_SECRET '...'
   yarn sst diff --stage staging     # what it's about to create; nothing should be in production
   yarn sst deploy --stage staging
   ```

   The migrator runs first, so this is also the migrations' trial run. When it finishes it prints the site's CloudFront address.
   Sign-in needs to know that address, which isn't known until now: add `https://<that address>/api/auth/callback/intercode` to the
   Intercode application's redirect URIs, and deploy again with it:

   ```sh
   APP_URL_BASE=https://<that address> yarn sst deploy --stage staging
   ```

   d. **Check it**: pages load; sign in through Intercode and see the account you expect, with your brands; edit a project; check the
   counts agree (`select count(*) from users where provider is not null and uid is not null` against
   `select count(*) from accounts`); upload a file and invite someone to a brand, which checks the upload and email code paths. The
   upload goes to the stage's own bucket, though, so it doesn't prove production's bucket settings: that check is in step 9.

   e. **Tear it down**: `yarn sst remove --stage staging` (if it complains that the bucket isn't empty, empty it first), delete the
   temporary RDS instance, and take the staging address out of the Intercode redirect URIs.

Merge `rr-backend-port` to `main` before the next step: the release workflow deploys what the release was made from.

## The cutover

8. **Move the DNS and deploy.** SST can't take over a DNS record that already exists, so the CNAMEs to `larp-library.fly.dev` have
   to go first, and the site is down from then until the new deployment is serving. Choose a quiet time, and have step 8b ready to
   start the moment 8a finishes:

   a. In neil-terraform, apply `01-release-larp-library-dns.patch`, which destroys exactly two records: the CNAMEs for
   `www.larplibrary.org` and `library.interactiveliterature.org`.

   b. Publish a release (or run the Release workflow by hand). It deploys the stage `production`: the migrator Lambda runs the
   remaining migrations, then the web function, CloudFront distribution and certificate are created and the DNS records written.
   Expect 10–20 minutes, most of it ACM validating the certificate and CloudFront creating its distribution.

9. **Check it** at <https://www.larplibrary.org>:
   - the home page, search and a brand and project page load, and <https://library.interactiveliterature.org> redirects to them;
   - **sign in** through Intercode, and the account is the one you had (matched by Intercode user id), with your brands;
   - **upload a file** to a project you can edit, and download it. This is the one thing the rehearsal can't cover: it exercises
     production's bucket's ACL setting and CORS rules with the presigned upload;
   - **invite someone** to a brand you administer, and check the email arrives (it goes through SES);
   - look through the Larp Library project in Sentry for anything unexpected.

## After

10. **Clean up**, once you're sure you won't go back (give it a few days): apply `02-remove-larp-library-fly-leftovers.patch` in
    neil-terraform (the `assets.larplibrary.org` CloudFront distribution, which only proxied the Rails app, the Fly API token secret,
    and the Rails-era Sentry release token output), then `fly apps destroy larp-library`. The snapshot from step 5 can go too.

## If it goes wrong

Before step 8 there's nothing to undo (the rehearsal's instance and stage are removed in step 7e). After it, the Fly app is still
running, so going back is: revert the DNS patch in neil-terraform (re-creating the two CNAMEs) after removing the SST-created
records. The database works for either app, with one caveat: anyone who first signed in on the new app has no `provider`/`uid` on
their `users` row, so the Rails app would treat them as new. If the data itself is damaged, restore the step 5 snapshot.

## Known gaps

- Server-side source maps aren't uploaded to Sentry, so stack traces from the deployed function show bundled line numbers.
- Nothing runs background jobs; emails are sent while the request is handled (a failure is logged, not retried).
