import { z } from 'zod';
import type { TagData } from '../../projectData';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { countProjectsWithTag, removeTagFromAllProjects } from '../repositories/projectsTags.server';
import {
  deleteTag as deleteTagRow,
  findTagWithCategory,
  insertTag,
  listTagsWithCategories,
  searchTagsByPrefix,
  updateTag as updateTagRow,
  type TagWithCategory,
} from '../repositories/tags.server';
import { failure, isForeignKeyViolation, type ActionResult } from './actionResult.server';
import { requireAbility, type AppAbility } from './authorization.server';
import { tagCategoryData } from './tagDisplay';

const tagAttributes = z.object({
  name: z.string().trim().min(1, "Name can't be blank"),
  tagCategoryId: z.number().int().nullish(),
});

function toTagData(row: TagWithCategory): TagData {
  return {
    id: row.id,
    name: row.name,
    tagCategory: row.tagCategory ? tagCategoryData(row.tagCategory) : null,
  };
}

/** Every tag, alphabetically regardless of case */
export async function listTags(db: ReadDb): Promise<TagData[]> {
  return (await listTagsWithCategories(db)).map(toTagData);
}

/** For the tag pickers: tags whose name, or whose category's name, starts with what's been typed */
export async function autocompleteTags(db: ReadDb, queryString: string): Promise<TagData[]> {
  return (await searchTagsByPrefix(db, queryString)).map(toTagData);
}

export type TagForEditing = { tag: TagData; projectCount: number };

/** A tag, and how many projects use it (all of them, since this is for an administrator deciding what to do with the tag) */
export async function findTagForEditing(db: ReadDb, id: number): Promise<TagForEditing | null> {
  const row = await findTagWithCategory(db, id);
  if (!row) {
    return null;
  }

  return { tag: toTagData(row), projectCount: await countProjectsWithTag(db, id) };
}

function parseAttributes(input: unknown) {
  const parsed = tagAttributes.safeParse(input);
  return parsed.success
    ? { attributes: { name: parsed.data.name, tagCategoryId: parsed.data.tagCategoryId ?? null } }
    : { errors: parsed.error.issues.map((issue) => issue.message) };
}

async function loadTag(db: DbOrTx, id: number): Promise<TagData> {
  const row = await findTagWithCategory(db, id);
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
    const id = await dbOrTx.transaction((tx) => insertTag(tx, attributes));
    return { ok: true, tag: await loadTag(dbOrTx, id) };
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
    const updatedId = await dbOrTx.transaction((tx) => updateTagRow(tx, id, attributes));
    if (updatedId === undefined) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    return { ok: true, tag: await loadTag(dbOrTx, updatedId) };
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
    await removeTagFromAllProjects(tx, id);
    return deleteTagRow(tx, id);
  });
  if (!deleted) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
}
