import { eq, ilike, inArray, or, sql } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '~/.server/db';
import { tagCategories, tags } from '~/.server/db/schema';

const AUTOCOMPLETE_LIMIT = 25;

/** A tag with its category (if it has one) */
export type TagWithCategory = typeof tags.$inferSelect & { tagCategory: typeof tagCategories.$inferSelect | null };

/** Every tag with its category, alphabetically regardless of case */
export async function listTagsWithCategories(db: ReadDb): Promise<TagWithCategory[]> {
  return db.query.tags.findMany({ with: { tagCategory: true }, orderBy: sql`upper(${tags.name})` });
}

/** The tags whose name, or whose category's name, starts with what's been typed (all of them if nothing has), alphabetically */
export async function searchTagsByPrefix(db: ReadDb, queryString: string): Promise<TagWithCategory[]> {
  // % and _ are wildcards in LIKE; what was typed means them literally
  const prefix = `${queryString.replace(/[\\%_]/g, '\\$&')}%`;

  const matching = queryString
    ? await db
        .select({ id: tags.id })
        .from(tags)
        .leftJoin(tagCategories, eq(tagCategories.id, tags.tagCategoryId))
        .where(or(ilike(tags.name, prefix), ilike(tagCategories.name, prefix)))
    : undefined;
  if (matching?.length === 0) {
    return [];
  }

  return db.query.tags.findMany({
    where: matching
      ? inArray(
          tags.id,
          matching.map((row) => row.id),
        )
      : undefined,
    with: { tagCategory: true },
    orderBy: sql`upper(${tags.name})`,
    limit: AUTOCOMPLETE_LIMIT,
  });
}

export async function findTagWithCategory(db: ReadDb, id: number): Promise<TagWithCategory | undefined> {
  return db.query.tags.findFirst({ where: eq(tags.id, id), with: { tagCategory: true } });
}

/** The tag with exactly this name */
export async function findTagWithCategoryByName(db: ReadDb, name: string): Promise<TagWithCategory | undefined> {
  return db.query.tags.findFirst({ where: eq(tags.name, name), with: { tagCategory: true } });
}

/** The id of the tag with exactly this name, if there is one */
export async function findTagIdByName(db: ReadDb, name: string): Promise<number | undefined> {
  return (await db.query.tags.findFirst({ where: eq(tags.name, name) }))?.id;
}

export async function insertTag(db: DbOrTx, values: { name: string; tagCategoryId?: number | null }): Promise<number> {
  const [row] = await db.insert(tags).values(values).returning({ id: tags.id });
  return row.id;
}

/** Returns the id of the changed tag, or undefined if there's none with this id */
export async function updateTag(
  db: DbOrTx,
  id: number,
  values: { name: string; tagCategoryId: number | null },
): Promise<number | undefined> {
  const [row] = await db.update(tags).set(values).where(eq(tags.id, id)).returning({ id: tags.id });
  return row?.id;
}

/** Returns whether there was a tag with this id to delete */
export async function deleteTag(db: DbOrTx, id: number): Promise<boolean> {
  const deleted = await db.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id });
  return deleted.length > 0;
}

/** Leaves the tags in a category without a category (for when the category is deleted) */
export async function clearTagCategory(db: DbOrTx, tagCategoryId: number) {
  await db.update(tags).set({ tagCategoryId: null }).where(eq(tags.tagCategoryId, tagCategoryId));
}
