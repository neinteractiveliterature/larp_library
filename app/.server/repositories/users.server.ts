import { and, eq, isNotNull } from 'drizzle-orm';
import type { ReadDb } from '~/.server/db';
import { users } from '~/.server/db/schema';

/**
 * A user's row by id, or null if there's no such user. better-auth hands ids around as strings even though this app's user
 * ids are integers, so this takes either.
 */
export async function findUserById(db: ReadDb, id: string | number) {
  const userId = Number(id);
  if (!Number.isInteger(userId)) {
    return null;
  }
  return (await db.query.users.findFirst({ where: eq(users.id, userId) })) ?? null;
}

/** The site administrators who have an email address to be reached at */
export async function listAdminsWithEmail(db: ReadDb) {
  return db
    .select()
    .from(users)
    .where(and(eq(users.admin, true), isNotNull(users.email)));
}
