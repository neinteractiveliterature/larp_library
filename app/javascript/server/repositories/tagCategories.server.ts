import { eq, ilike, sql } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '../db';
import { tagCategories, tags } from '../db/schema';

const AUTOCOMPLETE_LIMIT = 25;

/** Every category, alphabetically regardless of case */
export async function listTagCategories(db: ReadDb) {
  return db.query.tagCategories.findMany({ orderBy: sql`upper(${tagCategories.name})` });
}

/** The categories whose names start with what's been typed (all of them if nothing has), alphabetically */
export async function searchTagCategoriesByPrefix(db: ReadDb, queryString: string) {
  // % and _ are wildcards in LIKE; what was typed means them literally
  const prefix = queryString.replace(/[\\%_]/g, '\\$&');
  return db.query.tagCategories.findMany({
    where: queryString ? ilike(tagCategories.name, `${prefix}%`) : undefined,
    orderBy: sql`upper(${tagCategories.name})`,
    limit: AUTOCOMPLETE_LIMIT,
  });
}

/** A category with its tags, alphabetically */
export async function findTagCategoryWithTags(db: ReadDb, id: number) {
  return db.query.tagCategories.findFirst({
    where: eq(tagCategories.id, id),
    with: { tags: { orderBy: sql`upper(${tags.name})` } },
  });
}

export async function insertTagCategory(db: DbOrTx, values: typeof tagCategories.$inferInsert) {
  const [row] = await db.insert(tagCategories).values(values).returning();
  return row;
}

/** Returns the changed category, or undefined if there's none with this id */
export async function updateTagCategory(db: DbOrTx, id: number, values: Partial<typeof tagCategories.$inferInsert>) {
  const [row] = await db.update(tagCategories).set(values).where(eq(tagCategories.id, id)).returning();
  return row;
}

/** Returns whether there was a category with this id to delete */
export async function deleteTagCategory(db: DbOrTx, id: number): Promise<boolean> {
  const deleted = await db.delete(tagCategories).where(eq(tagCategories.id, id)).returning({ id: tagCategories.id });
  return deleted.length > 0;
}
