import { and, count, eq, inArray } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '../db';
import { brands, projects, projectsTags, tags } from '../db/schema';
import { brandIsApproved } from './brands.server';

/** The tags a project has (id and name only) */
export async function listTagsOfProject(db: ReadDb, projectId: number) {
  return db
    .select({ id: tags.id, name: tags.name })
    .from(projectsTags)
    .innerJoin(tags, eq(tags.id, projectsTags.tagId))
    .where(eq(projectsTags.projectId, projectId));
}

export async function addTagToProject(db: DbOrTx, projectId: number, tagId: number) {
  await db.insert(projectsTags).values({ projectId, tagId });
}

export async function removeTagsFromProject(db: DbOrTx, projectId: number, tagIds: number[]) {
  await db.delete(projectsTags).where(and(eq(projectsTags.projectId, projectId), inArray(projectsTags.tagId, tagIds)));
}

export async function removeAllTagsFromProject(db: DbOrTx, projectId: number) {
  await db.delete(projectsTags).where(eq(projectsTags.projectId, projectId));
}

/** Takes a tag off every project that has it (for when the tag is deleted) */
export async function removeTagFromAllProjects(db: DbOrTx, tagId: number) {
  await db.delete(projectsTags).where(eq(projectsTags.tagId, tagId));
}

/** How many projects have this tag, whoever's they are */
export async function countProjectsWithTag(db: ReadDb, tagId: number) {
  return db.$count(projectsTags, eq(projectsTags.tagId, tagId));
}

/** For each tag in use, how many projects anyone can see (those of approved brands) have it */
export async function countVisibleProjectsByTag(db: ReadDb) {
  return db
    .select({ tagId: projectsTags.tagId, projectCount: count() })
    .from(projectsTags)
    .innerJoin(projects, eq(projects.id, projectsTags.projectId))
    .innerJoin(brands, eq(brands.id, projects.brandId))
    .where(brandIsApproved)
    .groupBy(projectsTags.tagId);
}
