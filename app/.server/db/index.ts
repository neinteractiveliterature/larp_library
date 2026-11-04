import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '~/.server/env';
import * as schema from '~/.server/db/schema';

// Kept small deliberately: each Lambda execution environment holds its own pool, and a warm container can live for a
// while, so a large per-container max risks exhausting the database's connection limit under concurrent invocations.
// A container handles one request at a time, so a pool of 1 is enough for almost everything; the production database is
// shared with other apps and has only 100 connections in total (see the reserved concurrency in sst.config.ts).
// pg.Pool connects lazily, so constructing this at import time is safe.
//
// Every session runs in UTC. The `timestamp` (without time zone) columns store a naive wall-clock value in the
// session's timezone, while node-postgres always parses them back as UTC. Rails wrote them as UTC, so pinning the
// session keeps them from shifting by the server's default offset.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  options: '-c timezone=UTC',
  max: 1,
});

export const db = drizzle({ client: pool, casing: 'snake_case', schema });

export type Db = NodePgDatabase<typeof schema>;
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
/** Accepted by helpers that may run standalone or inside a caller's transaction. */
export type DbOrTx = Db | Tx;

/**
 * The read-only slice of a database handle. `Db` and `Tx` both satisfy it structurally, so read helpers can accept `ReadDb`
 * and still run inside a caller's transaction.
 */
export type ReadDb = Pick<Db, 'select' | 'selectDistinct' | 'query' | '$count'>;
