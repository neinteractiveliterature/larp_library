import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { env } from '~/server/env';

// sst.config.ts copies the repo's drizzle/ folder (the migration SQL and its meta/) next to this handler in the
// function's deployment package, so a relative path resolves regardless of where this source file lives.
export async function handler() {
  const pool = new Pool({ connectionString: env.DATABASE_URL, options: '-c timezone=UTC', max: 1 });
  try {
    await migrate(drizzle({ client: pool, casing: 'snake_case' }), { migrationsFolder: './drizzle' });
    console.log('migrator success');
  } finally {
    await pool.end();
  }
}
