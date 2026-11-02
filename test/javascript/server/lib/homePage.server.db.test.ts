// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brands, projectPromotions, projects, projectsTags, tagCategories, tags } from '~/server/db/schema';
import { db, resetDb, rollbackDb, setupDb, teardownDb } from '../support/db';
import { loadHomePage } from '~/server/lib/homePage.server';

describe('loadHomePage', () => {
  beforeAll(setupDb);
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  async function createBrand(name: string, approved: boolean) {
    const [brand] = await db.insert(brands).values({ name, slug: name.toLowerCase(), approved }).returning();
    return brand;
  }

  async function createProject(brandId: number, title: string, tagIds: number[] = []) {
    const [project] = await db.insert(projects).values({ brandId, title }).returning();
    if (tagIds.length > 0) {
      await db.insert(projectsTags).values(tagIds.map((tagId) => ({ projectId: project.id, tagId })));
    }
    return project;
  }

  it('lists promoted projects by title, leaving out those from unapproved brands', async () => {
    const approved = await createBrand('Approved', true);
    const unapproved = await createBrand('Unapproved', false);
    const zebra = await createProject(approved.id, 'Zebra Crossing');
    const aardvark = await createProject(approved.id, 'Aardvark Dawn');
    const hidden = await createProject(unapproved.id, 'Hidden Game');
    await createProject(approved.id, 'Not Promoted');
    await db.insert(projectPromotions).values([zebra, aardvark, hidden].map((project) => ({ projectId: project.id })));

    const { promotedProjects } = await loadHomePage(db);

    expect(promotedProjects.map((project) => project.title)).toEqual(['Aardvark Dawn', 'Zebra Crossing']);
    expect(promotedProjects[0].brand).toEqual({ id: approved.id, name: 'Approved', slug: 'approved' });
  });

  it('includes each promoted project’s tags, with their category’s display colors', async () => {
    const brand = await createBrand('Approved', true);
    const [genre] = await db
      .insert(tagCategories)
      .values({ name: 'Genre', color: '#ffff00', icon: 'star-fill' })
      .returning();
    const [comedy, plain] = await db
      .insert(tags)
      .values([{ name: 'comedy', tagCategoryId: genre.id }, { name: 'plain' }])
      .returning();
    const project = await createProject(brand.id, 'Tagged', [comedy.id, plain.id]);
    await db.insert(projectPromotions).values({ projectId: project.id });

    const { promotedProjects } = await loadHomePage(db);

    expect(promotedProjects[0].tags).toEqual(
      expect.arrayContaining([
        {
          id: comedy.id,
          name: 'comedy',
          tagCategory: { id: genre.id, name: 'Genre', color: '#ffff00', textColor: '#000000', icon: 'star-fill' },
        },
        { id: plain.id, name: 'plain', tagCategory: null },
      ]),
    );
  });

  it('groups tags by category (alphabetically, uncategorized last), counting only visible projects', async () => {
    const approved = await createBrand('Approved', true);
    const unapproved = await createBrand('Unapproved', false);
    const [genre, element] = await db
      .insert(tagCategories)
      .values([{ name: 'Genre' }, { name: 'Element' }])
      .returning();
    const [comedy, horde, drama, loose, unused] = await db
      .insert(tags)
      .values([
        { name: 'comedy', tagCategoryId: genre.id },
        { name: 'horde', tagCategoryId: element.id },
        { name: 'Drama', tagCategoryId: genre.id },
        { name: 'loose' },
        { name: 'unused', tagCategoryId: element.id },
      ])
      .returning();
    await createProject(approved.id, 'One', [comedy.id, horde.id]);
    await createProject(approved.id, 'Two', [comedy.id]);
    await createProject(unapproved.id, 'Three', [comedy.id, loose.id]);
    expect([drama, unused].length).toEqual(2);

    const { tagGroups } = await loadHomePage(db);

    expect(tagGroups.map((group) => group.category?.name ?? null)).toEqual(['Element', 'Genre', null]);
    const summary = tagGroups.map((group) => group.tags.map((tag) => `${tag.name}:${tag.projectCount}`));
    // tags are alphabetical regardless of case; the unapproved brand's project doesn't count
    expect(summary).toEqual([['horde:1', 'unused:0'], ['comedy:2', 'Drama:0'], ['loose:0']]);
  });

  it('is empty when there is nothing to show', async () => {
    expect(await loadHomePage(db)).toEqual({ promotedProjects: [], tagGroups: [] });
  });
});
