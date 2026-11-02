import './scripts/loadDevEnv';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: 'snake_case',
  // Rails-owned tables the app doesn't use; see app/server/db/schema.ts.
  tablesFilter: ['!ar_internal_metadata', '!schema_migrations', '!pg_search_documents'],
});
