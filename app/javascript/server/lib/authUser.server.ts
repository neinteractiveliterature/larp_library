import { eq } from 'drizzle-orm';
import { db, type DbOrTx } from '../db';
import { users } from '../db/schema';
import type { AuthUser } from './authContext';

/**
 * Loads a user's row by id. better-auth hands ids around as strings even though this app's user ids are integers, so
 * this takes either.
 */
export async function getUserById(id: string | number, dbOrTx: DbOrTx = db): Promise<AuthUser | null> {
  const userId = Number(id);
  if (!Number.isInteger(userId)) return null;
  return (await dbOrTx.query.users.findFirst({ where: eq(users.id, userId) })) ?? null;
}
