// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { asc } from 'drizzle-orm';
import { projectLinks } from '../db/schema';
import { addMember, createBrand, createProject, createUser, responseStatus } from '../test/factories';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../test/db';
import { buildAbility, loadAbility } from './authorization.server';
import {
  createProjectLink,
  deleteProjectLink,
  moveProjectLink,
  normalizeLinkUrl,
  updateProjectLink,
} from './projectLinks.server';

describe('normalizeLinkUrl', () => {
  it.each([
    ['https://example.com/rules', 'https://example.com/rules'],
    ['http://example.com', 'http://example.com'],
    ['example.com/rules', 'https://example.com/rules'],
    ['  www.example.com  ', 'https://www.example.com'],
    ['mailto:gm@example.com', 'mailto:gm@example.com'],
  ])('accepts %j as %j', (typed, normalized) => {
    expect(normalizeLinkUrl(typed)).toEqual(normalized);
  });

  it.each([
    ['javascript:alert(1)'],
    ['JavaScript:alert(1)'],
    ['data:text/html,<script>alert(1)</script>'],
    ['file:///etc/passwd'],
    ['ftp://example.com'],
    [''],
    ['https://'],
  ])('refuses %j', (typed) => {
    expect(normalizeLinkUrl(typed)).toBeNull();
  });
});

describe('project links', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  async function setup() {
    const brand = await createBrand();
    const member = await createUser();
    await addMember(brand.id, member.id);
    const project = await createProject(brand.id);
    return { brand, project, ability: await loadAbility(member, {}, db) };
  }

  const titlesInOrder = async () =>
    (await db.select().from(projectLinks).orderBy(asc(projectLinks.position))).map((l) => [l.title, l.position]);

  describe('creating', () => {
    it('adds a link at the end of the project’s links', async () => {
      const { project, ability } = await setup();

      await createProjectLink(
        ability,
        project.id,
        { title: 'Rules', url: 'https://example.com/rules', icon: 'book' },
        { db },
      );
      const second = await createProjectLink(ability, project.id, { title: 'Site', url: 'example.com' }, { db });

      expect(second.ok).toBe(true);
      expect(await titlesInOrder()).toEqual([
        ['Rules', 1],
        ['Site', 2],
      ]);
      expect(
        (await db.select().from(projectLinks).orderBy(asc(projectLinks.position))).map((l) => [l.url, l.icon]),
      ).toEqual([
        ['https://example.com/rules', 'book'],
        ['https://example.com', null],
      ]);
    });

    it('numbers each project’s links separately', async () => {
      const { project, ability, brand } = await setup();
      const other = await createProject(brand.id);
      await createProjectLink(ability, project.id, { title: 'A', url: 'a.example.com' }, { db });
      await createProjectLink(ability, project.id, { title: 'B', url: 'b.example.com' }, { db });

      await createProjectLink(ability, other.id, { title: 'First of other', url: 'c.example.com' }, { db });

      const [mine, theirs] = [project.id, other.id].map(async (id) =>
        (await db.select().from(projectLinks)).filter((l) => l.projectId === id).map((l) => l.position),
      );
      expect(await mine).toEqual([1, 2]);
      expect(await theirs).toEqual([1]);
    });

    it.each([
      [{ title: '', url: 'https://example.com' }, "Title can't be blank"],
      [{ title: 'T', url: '' }, "Url can't be blank"],
      [{ title: 'T', url: 'javascript:alert(1)' }, 'Url must be a web address'],
      [{ url: 'https://example.com' }, 'Invalid input'],
    ])('rejects %j', async (input, message) => {
      const { project, ability } = await setup();

      const result = await createProjectLink(ability, project.id, input, { db });

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.errors.join()).toContain(message);
      expect(await db.$count(projectLinks)).toEqual(0);
    });

    it('is forbidden to outsiders and visitors, and 404s for a project that does not exist', async () => {
      const { project } = await setup();
      const outsider = await createUser();
      const input = { title: 'T', url: 'https://example.com' };

      expect(
        await responseStatus(createProjectLink(await loadAbility(outsider, {}, db), project.id, input, { db })),
      ).toEqual(403);
      expect(await responseStatus(createProjectLink(buildAbility(null), project.id, input, { db }))).toEqual(403);
      expect(
        await responseStatus(createProjectLink(buildAbility({ id: 1, admin: true }), 999999, input, { db })),
      ).toEqual(404);
      expect(await db.$count(projectLinks)).toEqual(0);
    });
  });

  describe('updating', () => {
    it('changes a link, and clears its icon', async () => {
      const { project, ability } = await setup();
      const [link] = await db
        .insert(projectLinks)
        .values({ projectId: project.id, title: 'Old', url: 'https://old.example.com', icon: 'book', position: 1 })
        .returning();

      const result = await updateProjectLink(
        ability,
        link.id,
        { title: 'New', url: 'new.example.com', icon: '' },
        { db },
      );

      expect(result).toMatchObject({ ok: true });
      expect((await db.select().from(projectLinks))[0]).toMatchObject({
        title: 'New',
        url: 'https://new.example.com',
        icon: null,
        position: 1,
      });
    });

    it('rejects invalid changes, and is forbidden to outsiders', async () => {
      const { project, ability } = await setup();
      const outsider = await createUser();
      const [link] = await db
        .insert(projectLinks)
        .values({ projectId: project.id, title: 'Keep', url: 'https://keep.example.com', position: 1 })
        .returning();

      expect(await updateProjectLink(ability, link.id, { title: '', url: 'x.example.com' }, { db })).toMatchObject({
        ok: false,
      });
      expect(
        await responseStatus(
          updateProjectLink(
            await loadAbility(outsider, {}, db),
            link.id,
            { title: 'Hacked', url: 'x.example.com' },
            { db },
          ),
        ),
      ).toEqual(403);
      expect(
        await responseStatus(updateProjectLink(ability, 999999, { title: 'x', url: 'x.example.com' }, { db })),
      ).toEqual(404);
      expect((await db.select().from(projectLinks))[0].title).toEqual('Keep');
    });
  });

  describe('deleting and moving', () => {
    async function fourLinks() {
      const context = await setup();
      const rows = await db
        .insert(projectLinks)
        .values(
          ['a', 'b', 'c', 'd'].map((t, i) => ({
            projectId: context.project.id,
            title: t,
            url: `https://${t}.example.com`,
            position: i + 1,
          })),
        )
        .returning();
      return { ...context, links: rows };
    }

    it('deletes a link and closes up the order', async () => {
      const { links, ability } = await fourLinks();

      await deleteProjectLink(ability, links[1].id, { db });

      expect(await titlesInOrder()).toEqual([
        ['a', 1],
        ['c', 2],
        ['d', 3],
      ]);
    });

    it('moves a link to a new place and renumbers the rest', async () => {
      const { links, ability } = await fourLinks();

      await moveProjectLink(ability, links[0].id, 2, { db });
      expect(await titlesInOrder()).toEqual([
        ['b', 1],
        ['c', 2],
        ['a', 3],
        ['d', 4],
      ]);

      await moveProjectLink(ability, links[3].id, 0, { db });
      expect(await titlesInOrder()).toEqual([
        ['d', 1],
        ['b', 2],
        ['c', 3],
        ['a', 4],
      ]);
    });

    it('is forbidden to outsiders and visitors, and 404s for a link that does not exist', async () => {
      const { links } = await fourLinks();
      const outsider = await createUser();

      for (const ability of [await loadAbility(outsider, {}, db), buildAbility(null)]) {
        expect(await responseStatus(deleteProjectLink(ability, links[0].id, { db }))).toEqual(403);
        expect(await responseStatus(moveProjectLink(ability, links[0].id, 1, { db }))).toEqual(403);
      }
      expect(await responseStatus(deleteProjectLink(buildAbility({ id: 1, admin: true }), 999999, { db }))).toEqual(
        404,
      );
      expect(
        await responseStatus(moveProjectLink(buildAbility({ id: 1, admin: true }), links[0].id, 'x', { db })),
      ).toEqual(404);
      expect(await db.$count(projectLinks)).toEqual(4);
    });
  });
});
