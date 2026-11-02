// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brands, projects, projectsTags, tagCategories, tags } from '~/.server/db/schema';
import { db, resetDb, rollbackDb, setupDb, teardownDb } from '../support/db';
import { findTagByName, PROJECT_SEARCH_PAGE_SIZE, searchProjects } from '~/.server/lib/projectSearch.server';

describe('searchProjects', () => {
  let brandId: number;

  beforeAll(setupDb);
  afterAll(teardownDb);
  beforeEach(async () => {
    await resetDb();
    const [brand] = await db
      .insert(brands)
      .values({ name: 'Cool Games', slug: 'cool-games', approved: true })
      .returning();
    brandId = brand.id;
  });
  afterEach(rollbackDb);

  async function createProject(values: Partial<typeof projects.$inferInsert> & { title: string }) {
    const [project] = await db
      .insert(projects)
      .values({ brandId, ...values })
      .returning();
    return project;
  }

  async function titles(params: Parameters<typeof searchProjects>[1], options?: Parameters<typeof searchProjects>[2]) {
    return (await searchProjects(db, params, options)).projects.map((project) => project.title);
  }

  describe('with nothing to search for', () => {
    it('lists the projects of approved brands alphabetically, ignoring a leading article', async () => {
      const [hidden] = await db.insert(brands).values({ name: 'Hidden', slug: 'hidden', approved: false }).returning();
      await createProject({ title: 'The Zebra' });
      await createProject({ title: 'A Bear Hunt' });
      await createProject({ title: 'Carnival' });
      await createProject({ title: 'Not Visible', brandId: hidden.id });

      const page = await searchProjects(db, {});

      expect(page.projects.map((project) => project.title)).toEqual(['A Bear Hunt', 'Carnival', 'The Zebra']);
      expect(page.totalCount).toEqual(3);
      expect(page.projects[0].brand).toMatchObject({ name: 'Cool Games', slug: 'cool-games' });
    });

    it('pages through the results, and reports the total', async () => {
      for (let i = 0; i < PROJECT_SEARCH_PAGE_SIZE + 5; i++) {
        await createProject({ title: `Game ${String(i).padStart(3, '0')}` });
      }

      const first = await searchProjects(db, {});
      const second = await searchProjects(db, {}, { offset: PROJECT_SEARCH_PAGE_SIZE });

      expect(first.projects).toHaveLength(PROJECT_SEARCH_PAGE_SIZE);
      expect(first.totalCount).toEqual(PROJECT_SEARCH_PAGE_SIZE + 5);
      expect(second.projects.map((project) => project.title)).toEqual([
        'Game 025',
        'Game 026',
        'Game 027',
        'Game 028',
        'Game 029',
      ]);
      expect(second.offset).toEqual(PROJECT_SEARCH_PAGE_SIZE);
    });

    it('sends only the start of a long description', async () => {
      await createProject({ title: 'Wordy', description: 'x'.repeat(800) });
      await createProject({ title: 'Terse', description: 'short' });

      const { projects: results } = await searchProjects(db, {});

      expect(results.find((project) => project.title === 'Wordy')?.description).toHaveLength(500);
      expect(results.find((project) => project.title === 'Terse')?.description).toEqual('short');
    });
  });

  describe('searching for words', () => {
    it('matches any of the words, in titles, descriptions and authors, best matches first', async () => {
      await createProject({ title: 'Heist Night', description: 'A game about a heist at the opera' });
      await createProject({ title: 'Opera Mystery', description: 'Nothing to do with crime' });
      await createProject({ title: 'Gardening', authors: 'Heist Haverford' });
      await createProject({ title: 'Unrelated', description: 'Cooking' });

      const results = await titles({ queryString: 'heist opera' });

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual('Heist Night');
      expect(results).not.toContain('Unrelated');
    });

    it('ignores accents, in both the search and the text', async () => {
      await createProject({ title: 'Café Intrigue' });
      await createProject({ title: 'Plain Game', description: 'resume' });

      expect(await titles({ queryString: 'cafe' })).toEqual(['Café Intrigue']);
      expect(await titles({ queryString: 'Café' })).toEqual(['Café Intrigue']);
      expect(await titles({ queryString: 'résumé' })).toEqual(['Plain Game']);
    });

    it('uses English stemming', async () => {
      await createProject({ title: 'Running Wild' });

      expect(await titles({ queryString: 'run' })).toEqual(['Running Wild']);
    });

    it('can still match a project that has no description or authors', async () => {
      await createProject({ title: 'Barebones', description: null, authors: null });

      expect(await titles({ queryString: 'barebones' })).toEqual(['Barebones']);
    });

    it.each(["o'brien", 'what?', 'a:b', 'back\\slash', "!&|()<>'", '   '])(
      'copes with %j, which would be syntax in a tsquery',
      async (queryString) => {
        await createProject({ title: 'Anything' });

        await expect(searchProjects(db, { queryString })).resolves.toBeDefined();
      },
    );

    it("doesn't show unapproved brands' projects", async () => {
      const [hidden] = await db.insert(brands).values({ name: 'Hidden', slug: 'hidden', approved: false }).returning();
      await createProject({ title: 'Secret Heist', brandId: hidden.id });
      await createProject({ title: 'Public Heist' });

      expect(await titles({ queryString: 'heist' })).toEqual(['Public Heist']);
    });
  });

  describe('filters', () => {
    it('searches titles and authors separately', async () => {
      await createProject({ title: 'Heist Night', authors: 'Pat Smith' });
      await createProject({ title: 'Opera Night', authors: 'Sam Heist' });

      expect(await titles({ title: 'heist' })).toEqual(['Heist Night']);
      expect(await titles({ authors: 'heist' })).toEqual(['Opera Night']);
      expect(await titles({ title: 'night', authors: 'pat' })).toEqual(['Heist Night']);
    });

    it('finds the projects with a tag, by its exact name, once each', async () => {
      const [comedy, drama] = await db
        .insert(tags)
        .values([{ name: 'comedy' }, { name: 'drama' }])
        .returning();
      const both = await createProject({ title: 'Both' });
      const onlyComedy = await createProject({ title: 'Only Comedy' });
      await createProject({ title: 'Neither' });
      await db.insert(projectsTags).values([
        { projectId: both.id, tagId: comedy.id },
        { projectId: both.id, tagId: drama.id },
        { projectId: onlyComedy.id, tagId: comedy.id },
      ]);

      expect(await titles({ tag: 'comedy' })).toEqual(['Both', 'Only Comedy']);
      expect(await titles({ tag: 'Comedy' })).toEqual([]);
      expect((await searchProjects(db, { tag: 'comedy' })).totalCount).toEqual(2);
    });

    it('filters by how many players and facilitators a project takes', async () => {
      await createProject({ title: 'Small', minPlayers: 2, maxPlayers: 4, minFacilitators: 1, maxFacilitators: 1 });
      await createProject({ title: 'Big', minPlayers: 10, maxPlayers: 40, minFacilitators: 3, maxFacilitators: 5 });
      await createProject({ title: 'Unspecified' });

      // "upper bound": the project's maximum is at least this; "lower bound": its minimum is at most this
      expect(await titles({ playerCountUpperBound: 20 })).toEqual(['Big']);
      expect(await titles({ playerCountLowerBound: 5 })).toEqual(['Small']);
      expect(await titles({ playerCountUpperBound: 3, playerCountLowerBound: 3 })).toEqual(['Small']);
      expect(await titles({ facilitatorCountUpperBound: 4 })).toEqual(['Big']);
      expect(await titles({ facilitatorCountLowerBound: 1 })).toEqual(['Small']);
      expect(await titles({ playerCountUpperBound: null })).toEqual(['Big', 'Small', 'Unspecified']);
    });
  });

  it('includes each result’s tags', async () => {
    const [category] = await db.insert(tagCategories).values({ name: 'Genre', color: '#3366cc' }).returning();
    const [tag] = await db.insert(tags).values({ name: 'comedy', tagCategoryId: category.id }).returning();
    const project = await createProject({ title: 'Tagged' });
    await db.insert(projectsTags).values({ projectId: project.id, tagId: tag.id });

    const { projects: results } = await searchProjects(db, {});

    expect(results[0].tags).toEqual([
      {
        id: tag.id,
        name: 'comedy',
        tagCategory: { id: category.id, name: 'Genre', color: '#3366cc', textColor: '#ffffff', icon: 'tag' },
      },
    ]);
  });
});

describe('findTagByName', () => {
  beforeAll(setupDb);
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  it('finds a tag by its exact name, with its category', async () => {
    const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();
    const [tag] = await db.insert(tags).values({ name: 'comedy', tagCategoryId: category.id }).returning();

    expect(await findTagByName(db, 'comedy')).toMatchObject({
      id: tag.id,
      name: 'comedy',
      tagCategory: { name: 'Genre' },
    });
  });

  it.each([['Comedy'], ['nope'], [''], [undefined]])('returns null for %j', async (name) => {
    await db.insert(tags).values({ name: 'comedy' });

    expect(await findTagByName(db, name)).toBeNull();
  });
});
