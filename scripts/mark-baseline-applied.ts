// Records the baseline migration (drizzle/0000_baseline.sql) as already applied, for a database the Rails version of the app
// created: it has all of those tables already, so the migrator must not try to run it. Run this once, before the first deploy
// against such a database; after it, the migrator applies everything that comes after the baseline as usual.
//
//   DATABASE_URL=postgres://... yarn tsx scripts/mark-baseline-applied.ts
//
// (For the production RDS instance, which requires SSL, add `?sslmode=require` to the URL and run with
// NODE_EXTRA_CA_CERTS=./rds-global-bundle.pem.) It does nothing if any migration has already been recorded, so running it twice,
// or against a database the migrator has already been run on, is harmless.
import 'dotenv/config';
import path from 'node:path';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import { Client } from 'pg';

async function main() {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const [baseline] = readMigrationFiles({ migrationsFolder: path.resolve(import.meta.dirname, '../drizzle') });
  const client = new Client({ connectionString, options: '-c timezone=UTC' });
  await client.connect();
  try {
    // Exactly the table the migrator keeps its record in
    await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');
    await client.query(
      'CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)',
    );

    const { rows } = await client.query('SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations');
    if (rows[0].count > 0) {
      console.log(`Not changing anything: ${rows[0].count} migration(s) are already recorded.`);
      return;
    }

    await client.query('INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)', [
      baseline.hash,
      baseline.folderMillis,
    ]);
    console.log('Recorded the baseline migration as applied.');
  } finally {
    await client.end();
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
