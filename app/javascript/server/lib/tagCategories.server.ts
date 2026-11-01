import { eq, ilike, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { TagCategoryData, TagData } from '../../projectData';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { tagCategories, tags } from '../db/schema';
import { failure, isUniqueViolation, type ActionResult } from './actionResult.server';
import { requireAbility, type AppAbility } from './authorization.server';
import { tagCategoryData } from './tagDisplay';

const AUTOCOMPLETE_LIMIT = 25;

const tagCategoryAttributes = z.object({
  name: z.string().trim().min(1, "Name can't be blank"),
  // Blank means "use the default", as it did in Rails
  color: z
    .string()
    .nullish()
    .transform((color) => color || null)
    .pipe(
      z
        .string()
        .regex(/^#[0-9a-f]{6}$/i, 'Color is invalid')
        .nullable(),
    ),
  icon: z
    .string()
    .nullish()
    .transform((icon) => icon?.trim() || null),
});

export type TagCategoryWithTags = { tagCategory: TagCategoryData; tags: TagData[] };

export async function listTagCategories(db: ReadDb): Promise<TagCategoryData[]> {
  const rows = await db.query.tagCategories.findMany({ orderBy: sql`upper(${tagCategories.name})` });
  return rows.map(tagCategoryData);
}

/** For the picker on the tag form: categories whose names start with what's been typed */
export async function autocompleteTagCategories(db: ReadDb, queryString: string): Promise<TagCategoryData[]> {
  const prefix = queryString.replace(/[\\%_]/g, '\\$&');
  const rows = await db.query.tagCategories.findMany({
    where: queryString ? ilike(tagCategories.name, `${prefix}%`) : undefined,
    orderBy: sql`upper(${tagCategories.name})`,
    limit: AUTOCOMPLETE_LIMIT,
  });
  return rows.map(tagCategoryData);
}

export async function findTagCategory(db: ReadDb, id: number): Promise<TagCategoryWithTags | null> {
  const row = await db.query.tagCategories.findFirst({
    where: eq(tagCategories.id, id),
    with: { tags: { orderBy: sql`upper(${tags.name})` } },
  });
  if (!row) {
    return null;
  }

  const category = tagCategoryData(row);
  return {
    tagCategory: category,
    tags: row.tags.map((tag) => ({ id: tag.id, name: tag.name, tagCategory: category })),
  };
}

function parseAttributes(input: unknown) {
  const parsed = tagCategoryAttributes.safeParse(input);
  return parsed.success ? { attributes: parsed.data } : { errors: parsed.error.issues.map((issue) => issue.message) };
}

export async function createTagCategory(
  ability: AppAbility,
  input: unknown,
  dbOrTx: DbOrTx = realDb,
): Promise<ActionResult<{ tagCategory: TagCategoryData }>> {
  requireAbility(ability, 'create', 'TagCategory');
  const { attributes, errors } = parseAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  try {
    const [row] = await dbOrTx.transaction((tx) => tx.insert(tagCategories).values(attributes).returning());
    return { ok: true, tagCategory: tagCategoryData(row) };
  } catch (error) {
    if (isUniqueViolation(error, 'index_tag_categories_on_name')) {
      return failure('Name has already been taken');
    }
    throw error;
  }
}

export async function updateTagCategory(
  ability: AppAbility,
  id: number,
  input: unknown,
  dbOrTx: DbOrTx = realDb,
): Promise<ActionResult<{ tagCategory: TagCategoryData }>> {
  requireAbility(ability, 'update', 'TagCategory');
  const { attributes, errors } = parseAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  try {
    const [row] = await dbOrTx.transaction((tx) =>
      tx.update(tagCategories).set(attributes).where(eq(tagCategories.id, id)).returning(),
    );
    if (!row) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    return { ok: true, tagCategory: tagCategoryData(row) };
  } catch (error) {
    if (isUniqueViolation(error, 'index_tag_categories_on_name')) {
      return failure('Name has already been taken');
    }
    throw error;
  }
}

/** Deletes a category. Its tags aren't deleted, just left without a category. */
export async function deleteTagCategory(ability: AppAbility, id: number, dbOrTx: DbOrTx = realDb): Promise<void> {
  requireAbility(ability, 'delete', 'TagCategory');

  const deleted = await dbOrTx.transaction(async (tx) => {
    await tx.update(tags).set({ tagCategoryId: null }).where(eq(tags.tagCategoryId, id));
    return tx.delete(tagCategories).where(eq(tagCategories.id, id)).returning({ id: tagCategories.id });
  });
  if (deleted.length === 0) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
}
