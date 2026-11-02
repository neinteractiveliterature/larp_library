// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { projectsTags, tags } from '~/server/db/schema';
import {
  addTagToProject,
  countProjectsWithTag,
  countVisibleProjectsByTag,
  listTagsOfProject,
  removeTagFromAllProjects,
  removeTagsFromProject,
} from '~/server/repositories/projectsTags.server';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { createBrand, createProject } from '../support/factories';

describe('projectsTags repository', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  async function createTag(name: string) {
    const [tag] = await db.insert(tags).values({ name }).returning();
    return tag;
  }

  it('adds tags to a project, lists them, and takes some off', async () => {
    const project = await createProject((await createBrand()).id);
    const horde = await createTag('horde');
    const boffer = await createTag('boffer');
    await addTagToProject(db, project.id, horde.id);
    await addTagToProject(db, project.id, boffer.id);

    expect((await listTagsOfProject(db, project.id)).map((tag) => tag.name).sort()).toEqual(['boffer', 'horde']);

    await removeTagsFromProject(db, project.id, [horde.id]);

    expect((await listTagsOfProject(db, project.id)).map((tag) => tag.name)).toEqual(['boffer']);
  });

  it('counts a tag’s projects, all of them for the administrators and only visible ones for the public', async () => {
    const tag = await createTag('horde');
    const publicProject = await createProject((await createBrand({ approved: true })).id);
    const hiddenProject = await createProject((await createBrand({ approved: false })).id);
    await addTagToProject(db, publicProject.id, tag.id);
    await addTagToProject(db, hiddenProject.id, tag.id);

    expect(await countProjectsWithTag(db, tag.id)).toEqual(2);
    expect(await countVisibleProjectsByTag(db)).toEqual([{ tagId: tag.id, projectCount: 1 }]);
  });

  it('takes a tag off every project that has it, and only that tag', async () => {
    const brand = await createBrand();
    const first = await createProject(brand.id);
    const second = await createProject(brand.id);
    const doomed = await createTag('doomed');
    const kept = await createTag('kept');
    for (const project of [first, second]) {
      await addTagToProject(db, project.id, doomed.id);
      await addTagToProject(db, project.id, kept.id);
    }

    await removeTagFromAllProjects(db, doomed.id);

    const remaining = await db.select().from(projectsTags);
    expect(remaining.map((row) => row.tagId)).toEqual([kept.id, kept.id]);
  });
});
