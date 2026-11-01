import { eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { TagData } from '../../projectData';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { projectsTags, tagCategories, tags } from '../db/schema';
import { failure, isForeignKeyViolation, type ActionResult } from './actionResult.server';
import { requireAbility, type AppAbility } from './authorization.server';
import { tagCategoryData } from './tagDisplay';

const tagAttributes = z.object({
  name: z.string().trim().min(1, "Name can't be blank"),
  tagCategoryId: z.number().int().nullish(),
});

type TagRow = typeof tags.$inferSelect & { tagCategory: typeof tagCategories.$inferSelect | null };

function toTagData(row: TagRow): TagData {
  return {
    id: row.id,
    name: row.name,
    tagCategory: row.tagCategory ? tagCategoryData(row.tagCategory) : null,
  };
}

/** Every tag, alphabetically regardless of case */
export async function listTags(db: ReadDb): Promise<TagData[]> {
  const rows = await db.query.tags.findMany({ with: { tagCategory: true }, orderBy: sql`upper(${tags.name})` });
  return rows.map(toTagData);
}

const AUTOCOMPLETE_LIMIT = 25;

/** For the tag pickers: tags whose name, or whose category's name, starts with what's been typed */
export async function autocompleteTags(db: ReadDb, queryString: string): Promise<TagData[]> {
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

  const rows = await db.query.tags.findMany({
    where: matching
      ? (table, { inArray }) =>
          inArray(
            table.id,
            matching.map((row) => row.id),
          )
      : undefined,
    with: { tagCategory: true },
    orderBy: sql`upper(${tags.name})`,
    limit: AUTOCOMPLETE_LIMIT,
  });
  return rows.map(toTagData);
}

export type TagForEditing = { tag: TagData; projectCount: number };

/** A tag, and how many projects use it (all of them, since this is for an administrator deciding what to do with the tag) */
export async function findTagForEditing(db: ReadDb, id: number): Promise<TagForEditing | null> {
  const row = await db.query.tags.findFirst({ where: eq(tags.id, id), with: { tagCategory: true } });
  if (!row) {
    return null;
  }

  return { tag: toTagData(row), projectCount: await db.$count(projectsTags, eq(projectsTags.tagId, id)) };
}

function parseAttributes(input: unknown) {
  const parsed = tagAttributes.safeParse(input);
  return parsed.success
    ? { attributes: { name: parsed.data.name, tagCategoryId: parsed.data.tagCategoryId ?? null } }
    : { errors: parsed.error.issues.map((issue) => issue.message) };
}

async function loadTag(db: DbOrTx, id: number): Promise<TagData> {
  const row = await db.query.tags.findFirst({ where: eq(tags.id, id), with: { tagCategory: true } });
  if (!row) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
  return toTagData(row);
}

export async function createTag(
  ability: AppAbility,
  input: unknown,
  dbOrTx: DbOrTx = realDb,
): Promise<ActionResult<{ tag: TagData }>> {
  requireAbility(ability, 'create', 'Tag');
  const { attributes, errors } = parseAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  try {
    const [row] = await dbOrTx.transaction((tx) => tx.insert(tags).values(attributes).returning({ id: tags.id }));
    return { ok: true, tag: await loadTag(dbOrTx, row.id) };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return failure('Tag category does not exist');
    }
    throw error;
  }
}

export async function updateTag(
  ability: AppAbility,
  id: number,
  input: unknown,
  dbOrTx: DbOrTx = realDb,
): Promise<ActionResult<{ tag: TagData }>> {
  requireAbility(ability, 'update', 'Tag');
  const { attributes, errors } = parseAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  try {
    const [row] = await dbOrTx.transaction((tx) =>
      tx.update(tags).set(attributes).where(eq(tags.id, id)).returning({ id: tags.id }),
    );
    if (!row) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    return { ok: true, tag: await loadTag(dbOrTx, row.id) };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return failure('Tag category does not exist');
    }
    throw error;
  }
}

/** Deletes a tag, taking it off every project that had it */
export async function deleteTag(ability: AppAbility, id: number, dbOrTx: DbOrTx = realDb): Promise<void> {
  requireAbility(ability, 'delete', 'Tag');

  const deleted = await dbOrTx.transaction(async (tx) => {
    await tx.delete(projectsTags).where(eq(projectsTags.tagId, id));
    return tx.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id });
  });
  if (deleted.length === 0) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
}
