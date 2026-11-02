# Larp Library

An app to host larps for free download. You can see a running copy at [www.larplibrary.org](https://www.larplibrary.org).

This app is &copy; 2015 Nat Budin and is licensed under the MIT License. See the LICENSE file for details.

It's a [React Router](https://reactrouter.com) app in framework mode (server-rendered, with data loaded in route loaders and
changed in route actions), using [Drizzle](https://orm.drizzle.team) with PostgreSQL, [better-auth](https://better-auth.com)
(people sign in with their [Intercode](https://github.com/neinteractiveliterature/intercode) accounts) and
[CASL](https://casl.js.org) for authorization. It's deployed to AWS with [SST](https://sst.dev).

## Developing

You need Node (see `.node-version`), Yarn, and a PostgreSQL server.

```sh
yarn install
cp .env.example .env     # and fill in the values (see the comments in it)
createdb larp_library_development
yarn drizzle-kit migrate # create the tables
yarn start               # http://localhost:3042
```

Sign-in needs an OAuth application registered on Intercode (see `.env.example`); `yarn tsx` scripts and the tests don't.
`yarn start` runs Node with `NODE_USE_SYSTEM_CA=1`, so that it trusts the system's certificate authorities, including the
self-signed one a local Intercode (`https://intercode.test:5050`) uses.

The code is under `app/`:

- `routes/` has the route modules (the pages, with their loaders and actions, and the routes that are only actions or JSON), in a
  folder per feature. `routes.ts` says which URL each one answers.
- `components/` and `lib/` have what the routes share: the components, and the helpers and hooks, again with a folder per
  feature where there is one.
- `.server/` is the server-only code. React Router fails the build if anything the browser loads imports from a `.server` folder:
  - `db/` is the Drizzle schema and client.
  - `repositories/` has one file per table, with the queries and writes for it. They return rows and know nothing about who is
    asking or what the page needs.
  - `lib/` is what the loaders and actions call: it checks authorization and input, calls the repositories, sends email and uses
    file storage, and shapes the result into what a page shows.
  - `emails/` and `handlers/` (the migrator Lambda) are what they sound like.

Server functions take what they depend on (the database, the ability, file storage, a mail transport) as arguments, so tests can
hand them stand-ins or a test database.

### Database

The schema is `app/.server/db/schema.ts`. Change it and run `yarn drizzle-kit generate` to write a migration into
`drizzle/`; migrations run with `yarn drizzle-kit migrate` locally and automatically on every deploy. `drizzle/0000_baseline.sql`
is the schema the Rails version of the app left behind: a production database that already has it must have it recorded as applied
(see below) rather than run again.

### Tests

All the tests are under `test/`, in the same layout as the code they cover (`app/routes/brands/BrandPage.tsx` is
tested by `test/routes/brands/BrandPage.test.tsx`; the tests of `app/.server` are in `test/server`), and import the app's code through `~/` (that is, `app/`).

```sh
yarn test            # Vitest
yarn typecheck       # react-router typegen && tsc
yarn lint            # oxlint
```

The server code is tested against a real PostgreSQL (`TEST_DATABASE_URL`, `postgres://postgres@localhost/larp_library_test` by
default); each test worker creates a database of its own on that server.

## Deploying

`.github/workflows/release.yml` runs `sst deploy --stage=production` when a release is published (or by hand). It needs these
repository secrets: `AWS_OIDC_ROLE`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `SENTRY_ORG`, `SENTRY_PROJECT` and
`SENTRY_AUTH_TOKEN`. The infrastructure around it (the AWS deploy role, the database, the uploads bucket, the Cloudflare zone and
the SES identity) is in the [neil-terraform](https://github.com/neinteractiveliterature/neil-terraform) repository.

Each stage needs its SST secrets set once with `sst secret set --stage production NAME value`:

| Secret                                     | What it is                                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                             | The production database (RDS requires SSL: add `?sslmode=require`)                                                             |
| `BETTER_AUTH_SECRET`                       | A long random string that signs sessions                                                                                       |
| `INTERCODE_APP_ID`, `INTERCODE_APP_SECRET` | The OAuth application registered on Intercode, whose redirect URI is `https://www.larplibrary.org/api/auth/callback/intercode` |

### Migrating a database that came from the Rails app

(The whole move from the Rails app on Fly is laid out in [docs/cutover.md](docs/cutover.md).)

The first deploy against a database the Rails app created must not run `0000_baseline.sql`, which would fail on the tables that
already exist. Record it as applied first, once, with:

```sh
NODE_EXTRA_CA_CERTS=./rds-global-bundle.pem \
  DATABASE_URL='postgres://...?sslmode=require' \
  yarn tsx scripts/mark-baseline-applied.ts
```

It's harmless to run twice (it does nothing once any migration has been recorded). After that, the migrator that runs on every
deploy applies what comes after the baseline: the sign-in tables, with a record for each existing user (matched by their Intercode
user id, so everyone's account and brands are kept), and the `created_at`/`updated_at` defaults. Old Rails sessions don't carry
over, so everyone signs in again.
