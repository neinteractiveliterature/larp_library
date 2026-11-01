// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import {
  projectFiles,
  projectLinks,
  projectPromotions,
  projects,
  projectsTags,
  tagCategories,
  tags,
} from '../db/schema';
import { addMember, createBrand, createProject, createUser, responseStatus } from '../test/factories';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../test/db';
import { buildAbility, loadAbility } from './authorization.server';
import {
  createProject as createProjectInDb,
  deleteProject,
  findBrandForNewProject,
  findProjectPage,
  projectIdFromParam,
  updateProject,
} from './projects.server';

describe('projectIdFromParam', () => {
  it.each([
    ['112', 112],
    ['112-1-900-psy-chic', 112],
    ['7-the-big-larp', 7],
  ])('reads the id from %j', (param, id) => {
    expect(projectIdFromParam(param)).toEqual(id);
  });

  it.each([['abc'], ['-5'], ['']])('is a 404 for %j', (param) => {
    expect(() => projectIdFromParam(param)).toThrow(Response);
  });
});

describe('projects', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  const fakeStorage = () => ({ deleteFile: vi.fn().mockResolvedValue(undefined) });

  describe('a project’s page', () => {
    it('has everything the page shows, in order, with the license looked up', async () => {
      const brand = await createBrand({ name: 'Cool Games', slug: 'cool-games' });
      const project = await createProject(brand.id, {
        title: 'Big Heist',
        authors: 'Pat Smith',
        description: 'A **big** heist',
        license: 'cc40_by',
        minPlayers: 4,
        maxPlayers: 8,
        publicationYear: 2024,
      });
      await db.insert(projectFiles).values([
        { projectId: project.id, url: 'u2', filename: 'second.pdf', filesize: 20, filepath: 'uploads/2', position: 2 },
        { projectId: project.id, url: 'u1', filename: 'first.pdf', filesize: 10, filepath: 'uploads/1', position: 1 },
        {
          projectId: project.id,
          url: 'u3',
          filename: 'legacy.pdf',
          filesize: 30,
          filepath: 'uploads/3',
          position: null,
        },
      ]);
      await db.insert(projectLinks).values([
        { projectId: project.id, url: 'https://b.example.com', title: 'B', position: 2 },
        { projectId: project.id, url: 'https://a.example.com', title: 'A', position: 1, icon: 'github' },
      ]);
      const [category] = await db.insert(tagCategories).values({ name: 'Genre', color: '#ffff00' }).returning();
      const [tag] = await db.insert(tags).values({ name: 'heist', tagCategoryId: category.id }).returning();
      await db.insert(projectsTags).values({ projectId: project.id, tagId: tag.id });

      const { project: page } = await findProjectPage(db, buildAbility(null), `${project.id}-big-heist`);

      expect(page).toMatchObject({
        id: project.id,
        title: 'Big Heist',
        authors: 'Pat Smith',
        description: 'A **big** heist',
        publicationYear: 2024,
        minPlayers: 4,
        brand: { name: 'Cool Games', slug: 'cool-games' },
        license: { id: 'cc40_by', name: 'Creative Commons Attribution 4.0 International' },
      });
      expect(page.projectFiles.map((file) => file.filename)).toEqual(['first.pdf', 'second.pdf', 'legacy.pdf']);
      expect(page.projectLinks.map((link) => [link.title, link.icon])).toEqual([
        ['A', 'github'],
        ['B', null],
      ]);
      expect(page.tags).toEqual([
        { id: tag.id, name: 'heist', tagCategory: expect.objectContaining({ name: 'Genre', textColor: '#000000' }) },
      ]);
    });

    it('has no license when the project has none, or one that no longer exists', async () => {
      const brand = await createBrand();
      const plain = await createProject(brand.id);
      const odd = await createProject(brand.id, { license: 'long_gone_license' });

      expect((await findProjectPage(db, buildAbility(null), String(plain.id))).project.license).toBeNull();
      expect((await findProjectPage(db, buildAbility(null), String(odd.id))).project.license).toBeNull();
    });

    it('tells the page what the viewer can do', async () => {
      const brand = await createBrand();
      const project = await createProject(brand.id);
      const member = await createUser();
      const siteAdmin = await createUser({ admin: true });
      await addMember(brand.id, member.id);

      const flags = async (viewer: Parameters<typeof loadAbility>[0]) => {
        const { project: page } = await findProjectPage(db, await loadAbility(viewer, {}, db), String(project.id));
        return [
          page.currentUserCanEdit,
          page.currentUserCanDelete,
          page.currentUserCanUploadFiles,
          page.currentUserCanDeleteFiles,
        ];
      };

      expect(await flags(null)).toEqual([false, false, false, false]);
      expect(await flags(member)).toEqual([true, true, true, true]);
      expect(await flags(siteAdmin)).toEqual([true, true, true, true]);
    });

    it('is a 404 for a project of an unapproved brand, except to its members and site administrators', async () => {
      const brand = await createBrand({ approved: false });
      const project = await createProject(brand.id);
      const member = await createUser();
      const outsider = await createUser();
      await addMember(brand.id, member.id);

      expect(await responseStatus(findProjectPage(db, buildAbility(null), String(project.id)))).toEqual(404);
      expect(
        await responseStatus(findProjectPage(db, await loadAbility(outsider, {}, db), String(project.id))),
      ).toEqual(404);
      expect((await findProjectPage(db, await loadAbility(member, {}, db), String(project.id))).project.id).toEqual(
        project.id,
      );
      expect(await responseStatus(findProjectPage(db, buildAbility(null), '999999'))).toEqual(404);
    });

    it('can be required to be one the viewer may edit', async () => {
      const brand = await createBrand();
      const project = await createProject(brand.id);
      const member = await createUser();
      const outsider = await createUser();
      await addMember(brand.id, member.id);

      expect(
        (await findProjectPage(db, await loadAbility(member, {}, db), String(project.id), { editing: true })).project
          .id,
      ).toEqual(project.id);
      expect(
        await responseStatus(
          findProjectPage(db, await loadAbility(outsider, {}, db), String(project.id), { editing: true }),
        ),
      ).toEqual(403);
      expect(
        await responseStatus(findProjectPage(db, buildAbility(null), String(project.id), { editing: true })),
      ).toEqual(403);
    });
  });

  describe('the new project form', () => {
    it('gives members the brand, and forbids anyone else', async () => {
      const brand = await createBrand({ slug: 'cool-games' });
      const member = await createUser();
      const outsider = await createUser();
      await addMember(brand.id, member.id);

      expect(await findBrandForNewProject(db, await loadAbility(member, {}, db), 'cool-games')).toEqual({
        brand: { id: brand.id, name: brand.name, slug: 'cool-games' },
      });
      expect(
        await responseStatus(findBrandForNewProject(db, await loadAbility(outsider, {}, db), 'cool-games')),
      ).toEqual(403);
      expect(await responseStatus(findBrandForNewProject(db, buildAbility(null), 'cool-games'))).toEqual(403);
      expect(await responseStatus(findBrandForNewProject(db, buildAbility(null), 'no-such-brand'))).toEqual(404);
    });

    it('is a 404 for a brand nobody outside can see', async () => {
      const brand = await createBrand({ slug: 'pending', approved: false });
      const outsider = await createUser();

      expect(await responseStatus(findBrandForNewProject(db, await loadAbility(outsider, {}, db), brand.slug))).toEqual(
        404,
      );
    });
  });

  describe('creating', () => {
    async function memberAbility() {
      const brand = await createBrand({ slug: 'cool-games' });
      const member = await createUser();
      await addMember(brand.id, member.id);
      return { brand, ability: await loadAbility(member, {}, db) };
    }

    it('creates a project with its properties and tags, creating tags that do not exist yet', async () => {
      const { brand, ability } = await memberAbility();
      const [existing] = await db.insert(tags).values({ name: 'comedy' }).returning();

      const result = await createProjectInDb(
        ability,
        brand.id,
        {
          title: 'Big Heist',
          authors: 'Pat Smith',
          description: 'A heist',
          licenseId: 'cc40_by_sa',
          publicationYear: 2024,
          minPlayers: 4,
          maxPlayers: 8,
          lengthQuantity: 3,
          lengthUnits: 'hours',
          tagNames: ['comedy', 'brand-new', '  ', 'Comedy'],
        },
        { db },
      );

      expect(result).toMatchObject({ ok: true, project: { title: 'Big Heist', brand: { slug: 'cool-games' } } });
      const [project] = await db.select().from(projects);
      expect(project).toMatchObject({
        brandId: brand.id,
        title: 'Big Heist',
        license: 'cc40_by_sa',
        minPlayers: 4,
        lengthUnits: 'hours',
      });
      const attached = await db
        .select({ id: tags.id, name: tags.name })
        .from(projectsTags)
        .innerJoin(tags, eq(tags.id, projectsTags.tagId))
        .where(eq(projectsTags.projectId, project.id));
      // the existing tag was reused, one new tag was made, and the blank name and the repeat were ignored
      expect(attached.map((tag) => tag.name).sort()).toEqual(['brand-new', 'comedy']);
      expect(attached.find((tag) => tag.name === 'comedy')?.id).toEqual(existing.id);
      expect(await db.$count(tags)).toEqual(2);
    });

    it('stores text that is only whitespace as nothing', async () => {
      const { brand, ability } = await memberAbility();

      await createProjectInDb(
        ability,
        brand.id,
        { title: 'Titled', authors: '  ', description: '', lengthUnits: ' ' },
        { db },
      );

      expect((await db.select().from(projects))[0]).toMatchObject({
        authors: null,
        description: null,
        lengthUnits: null,
      });
    });

    it.each([
      [{ licenseId: 'not_a_license' }, 'License is not included in the list'],
      [{ minPlayers: 'four' }, 'Invalid input'],
      [{ tagNames: 'comedy' }, 'Invalid input'],
    ])('rejects %j', async (input, message) => {
      const { brand, ability } = await memberAbility();

      const result = await createProjectInDb(ability, brand.id, input, { db });

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.errors.join()).toContain(message);
      expect(await db.$count(projects)).toEqual(0);
    });

    it('is forbidden to anyone who does not belong to the brand, and 404s for a brand that does not exist', async () => {
      const brand = await createBrand();
      const outsider = await createUser();

      expect(
        await responseStatus(createProjectInDb(await loadAbility(outsider, {}, db), brand.id, { title: 'x' }, { db })),
      ).toEqual(403);
      expect(await responseStatus(createProjectInDb(buildAbility(null), brand.id, { title: 'x' }, { db }))).toEqual(
        403,
      );
      expect(await responseStatus(createProjectInDb(buildAbility({ id: 1, admin: true }), 999999, {}, { db }))).toEqual(
        404,
      );
      expect(await db.$count(projects)).toEqual(0);
    });
  });

  describe('updating', () => {
    async function setup() {
      const brand = await createBrand({ slug: 'cool-games' });
      const member = await createUser();
      await addMember(brand.id, member.id);
      const project = await createProject(brand.id, { title: 'Old Title', authors: 'Old Author', license: 'cc40_by' });
      return { brand, project, ability: await loadAbility(member, {}, db) };
    }

    it('changes the properties given, and leaves the others alone', async () => {
      const { project, ability } = await setup();

      const result = await updateProject(ability, project.id, { title: 'New Title', minPlayers: 3 }, { db });

      expect(result).toMatchObject({
        ok: true,
        project: { id: project.id, title: 'New Title', brand: { slug: 'cool-games' } },
      });
      expect((await db.select().from(projects))[0]).toMatchObject({
        title: 'New Title',
        authors: 'Old Author',
        license: 'cc40_by',
        minPlayers: 3,
      });
    });

    it('clears a property that is given as null', async () => {
      const { project, ability } = await setup();

      await updateProject(ability, project.id, { authors: null, licenseId: null }, { db });

      expect((await db.select().from(projects))[0]).toMatchObject({ authors: null, license: null });
    });

    it('replaces the tags with the ones given, but leaves them alone when none are given', async () => {
      const { project, ability } = await setup();
      const [keep, drop] = await db
        .insert(tags)
        .values([{ name: 'Keep' }, { name: 'drop' }])
        .returning();
      await db.insert(projectsTags).values([
        { projectId: project.id, tagId: keep.id },
        { projectId: project.id, tagId: drop.id },
      ]);
      const tagNamesOf = async () =>
        (
          await db
            .select({ name: tags.name })
            .from(projectsTags)
            .innerJoin(tags, eq(tags.id, projectsTags.tagId))
            .where(eq(projectsTags.projectId, project.id))
        )
          .map((row) => row.name)
          .sort();

      await updateProject(ability, project.id, { title: 'No tags given' }, { db });
      expect(await tagNamesOf()).toEqual(['Keep', 'drop']);

      // (a name is matched ignoring case, so "keep" is the "Keep" tag it already has)
      await updateProject(ability, project.id, { tagNames: ['keep', 'added'] }, { db });
      expect(await tagNamesOf()).toEqual(['Keep', 'added']);

      await updateProject(ability, project.id, { tagNames: [] }, { db });
      expect(await tagNamesOf()).toEqual([]);
      // the tags themselves aren't deleted, just taken off the project
      expect(await db.$count(tags)).toEqual(3);
    });

    it('will not take the license off a project that has files', async () => {
      const { project, ability } = await setup();
      await db
        .insert(projectFiles)
        .values({ projectId: project.id, url: 'u', filename: 'f.pdf', filesize: 1, filepath: 'uploads/f' });

      expect(await updateProject(ability, project.id, { licenseId: null }, { db })).toEqual({
        ok: false,
        errors: ['License is required because this project has downloadable files'],
      });
      expect((await db.select().from(projects))[0].license).toEqual('cc40_by');
      // changing it to another license is fine
      expect(await updateProject(ability, project.id, { licenseId: 'mit' }, { db })).toMatchObject({ ok: true });
    });

    it('rejects a license that does not exist', async () => {
      const { project, ability } = await setup();

      expect(await updateProject(ability, project.id, { licenseId: 'nope' }, { db })).toEqual({
        ok: false,
        errors: ['License is not included in the list'],
      });
    });

    it('is forbidden to outsiders and visitors, and 404s for a project that does not exist', async () => {
      const { project } = await setup();
      const outsider = await createUser();

      expect(
        await responseStatus(
          updateProject(await loadAbility(outsider, {}, db), project.id, { title: 'Hacked' }, { db }),
        ),
      ).toEqual(403);
      expect(await responseStatus(updateProject(buildAbility(null), project.id, { title: 'Hacked' }, { db }))).toEqual(
        403,
      );
      expect(await responseStatus(updateProject(buildAbility({ id: 1, admin: true }), 999999, {}, { db }))).toEqual(
        404,
      );
      expect((await db.select().from(projects))[0].title).toEqual('Old Title');
    });
  });

  describe('deleting', () => {
    it('deletes the project with its files, links, tags and promotion, and removes its files from storage', async () => {
      const brand = await createBrand();
      const member = await createUser();
      await addMember(brand.id, member.id);
      const project = await createProject(brand.id);
      const other = await createProject(brand.id);
      const [tag] = await db.insert(tags).values({ name: 'comedy' }).returning();
      await db.insert(projectsTags).values([
        { projectId: project.id, tagId: tag.id },
        { projectId: other.id, tagId: tag.id },
      ]);
      await db.insert(projectPromotions).values({ projectId: project.id });
      await db
        .insert(projectLinks)
        .values({ projectId: project.id, url: 'https://a.example.com', title: 'A', position: 1 });
      await db.insert(projectFiles).values([
        { projectId: project.id, url: 'u1', filename: 'a.pdf', filesize: 1, filepath: 'uploads/1-a/a.pdf' },
        // files recorded before keys were stored plainly have the bucket in front
        {
          projectId: project.id,
          url: 'u2',
          filename: 'b.pdf',
          filesize: 1,
          filepath: '/test-bucket/uploads/2-b/b.pdf',
        },
        { projectId: other.id, url: 'u3', filename: 'c.pdf', filesize: 1, filepath: 'uploads/3-c/c.pdf' },
      ]);
      const storage = fakeStorage();

      await deleteProject(await loadAbility(member, {}, db), project.id, { db, storage });

      expect((await db.select().from(projects)).map((p) => p.id)).toEqual([other.id]);
      expect(await db.$count(projectPromotions)).toEqual(0);
      expect(await db.$count(projectLinks)).toEqual(0);
      expect((await db.select().from(projectFiles)).map((f) => f.filename)).toEqual(['c.pdf']);
      expect(await db.select().from(projectsTags)).toEqual([{ projectId: other.id, tagId: tag.id }]);
      expect(storage.deleteFile.mock.calls.map(([key]) => key).sort()).toEqual([
        'uploads/1-a/a.pdf',
        'uploads/2-b/b.pdf',
      ]);
    });

    it('still deletes the project when a file cannot be removed from storage', async () => {
      const brand = await createBrand();
      const project = await createProject(brand.id);
      await db
        .insert(projectFiles)
        .values({ projectId: project.id, url: 'u', filename: 'a.pdf', filesize: 1, filepath: 'uploads/a' });
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

      await deleteProject(buildAbility({ id: 1, admin: true }), project.id, {
        db,
        storage: { deleteFile: vi.fn().mockRejectedValue(new Error('S3 down')) },
      });

      expect(await db.$count(projects)).toEqual(0);
      expect(errorLog).toHaveBeenCalled();
      errorLog.mockRestore();
    });

    it('is forbidden to outsiders and visitors, and 404s for a project that does not exist', async () => {
      const brand = await createBrand();
      const project = await createProject(brand.id);
      const outsider = await createUser();
      const storage = fakeStorage();

      expect(
        await responseStatus(deleteProject(await loadAbility(outsider, {}, db), project.id, { db, storage })),
      ).toEqual(403);
      expect(await responseStatus(deleteProject(buildAbility(null), project.id, { db, storage }))).toEqual(403);
      expect(
        await responseStatus(deleteProject(buildAbility({ id: 1, admin: true }), 999999, { db, storage })),
      ).toEqual(404);
      expect(await db.$count(projects)).toEqual(1);
      expect(storage.deleteFile).not.toHaveBeenCalled();
    });
  });
});
