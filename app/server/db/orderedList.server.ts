import { sql } from 'drizzle-orm';
import type { DbOrTx } from './index';

/**
 * Runs `change` in a transaction that holds a lock for one ordered list (a project's files, say).
 *
 * Adding to a list means reading its highest position and inserting one more than that. At Postgres's default isolation level
 * two concurrent additions can both read the same highest value and take the same position, and nothing in the schema stops it;
 * moving or removing an item has the same trouble renumbering the rest. Taking this lock first makes the second change wait
 * until the first has committed, so it sees the first's result.
 *
 * `listKey` names the list, for example `project_files:12`; changes to different lists never wait on each other. It's hashed
 * into the 64-bit advisory lock key space.
 */
export async function withOrderedListLock<T>(
  dbOrTx: DbOrTx,
  listKey: string,
  change: (tx: DbOrTx) => Promise<T>,
): Promise<T> {
  return dbOrTx.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${listKey}, 0))`);
    return change(tx);
  });
}

/**
 * `ids` with the one at `fromIndex` moved to `toIndex`, as when an item is dragged to a new place in a list. A destination past
 * either end puts the item at that end.
 */
export function moveItem<T>(ids: readonly T[], fromIndex: number, toIndex: number): T[] {
  const moved = [...ids];
  const [item] = moved.splice(fromIndex, 1);
  moved.splice(Math.max(0, Math.min(toIndex, moved.length)), 0, item);
  return moved;
}
