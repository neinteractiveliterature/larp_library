import { createContext } from 'react-router';
import { db, type ReadDb } from '~/.server/db';

export type { ReadDb };

/**
 * The database handle loaders (and the read side of actions) use. It's the read-only slice of the database, so that
 * request-handling code has to go through a *.server.ts function that owns its invariants to write anything. Defaults to
 * the real database; tests put their own in context.
 */
export const readDbContext = createContext<ReadDb>(db);
