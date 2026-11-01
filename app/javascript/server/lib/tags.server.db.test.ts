// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brands, projects, projectsTags, tagCategories, tags } from '../db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../test/db';
import { buildAbility } from './authorization.server';
import { autocompleteTags, createTag, deleteTag, findTagForEditing, listTags, updateTag } from './tags.server';

const admin = buildAbility({ id: 1, admin: true });
const notAdmin = buildAbility({ id: 2, admin: false });
const signedOut = buildAbility(null);

async function responseStatus(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error instanceof Response ? error.status : error;
  }
  return null;
}

describe('tags', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  it('lists every tag alphabetically regardless of case, with its category', async () => {
    const [category] = await db.insert(tagCategories).values({ name: 'Genre', color: '#ffff00' }).returning();
    await db
      .insert(tags)
      .values([{ name: 'drama' }, { name: 'Comedy', tagCategoryId: category.id }, { name: 'action' }]);

    const listed = await listTags(db);

    expect(listed.map((tag) => tag.name)).toEqual(['action', 'Comedy', 'drama']);
    expect(listed[1].tagCategory).toMatchObject({ name: 'Genre', color: '#ffff00', textColor: '#000000' });
    expect(listed[0].tagCategory).toBeNull();
  });

  it('finds a tag to edit, counting every project that uses it, whoever they belong to', async () => {
    const [approved, unapproved] = await db
      .insert(brands)
      .values([
        { name: 'A', slug: 'a', approved: true },
        { name: 'B', slug: 'b', approved: false },
      ])
      .returning();
    const [one, two] = await db
      .insert(projects)
      .values([
        { title: 'One', brandId: approved.id },
        { title: 'Two', brandId: unapproved.id },
      ])
      .returning();
    const [tag] = await db.insert(tags).values({ name: 'comedy' }).returning();
    await db.insert(projectsTags).values([
      { projectId: one.id, tagId: tag.id },
      { projectId: two.id, tagId: tag.id },
    ]);

    expect(await findTagForEditing(db, tag.id)).toMatchObject({ tag: { name: 'comedy' }, projectCount: 2 });
    expect(await findTagForEditing(db, 123456)).toBeNull();
  });

  describe('creating', () => {
    it('creates a tag, optionally in a category', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();

      const plain = await createTag(admin, { name: ' plain ' }, db);
      const categorized = await createTag(admin, { name: 'comedy', tagCategoryId: category.id }, db);

      expect(plain).toMatchObject({ ok: true, tag: { name: 'plain', tagCategory: null } });
      expect(categorized).toMatchObject({ ok: true, tag: { name: 'comedy', tagCategory: { name: 'Genre' } } });
      expect(await db.$count(tags)).toEqual(2);
    });

    it.each([
      [{ name: '' }, "Name can't be blank"],
      [{ name: '  ' }, "Name can't be blank"],
      [{}, 'Invalid input'],
      [{ name: 'x', tagCategoryId: 'abc' }, 'Invalid input'],
    ])('rejects %j', async (input, message) => {
      const result = await createTag(admin, input, db);

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.errors.join()).toContain(message);
      expect(await db.$count(tags)).toEqual(0);
    });

    it('rejects a category that does not exist', async () => {
      expect(await createTag(admin, { name: 'x', tagCategoryId: 123456 }, db)).toEqual({
        ok: false,
        errors: ['Tag category does not exist'],
      });
      expect(await db.$count(tags)).toEqual(0);
    });

    it.each([
      ['a signed-in user who is not an admin', notAdmin],
      ['a signed-out visitor', signedOut],
    ])('is forbidden to %s', async (_, ability) => {
      expect(await responseStatus(createTag(ability, { name: 'x' }, db))).toEqual(403);
      expect(await db.$count(tags)).toEqual(0);
    });
  });

  describe('updating', () => {
    it('renames a tag and moves it between categories, or out of one', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();
      const [tag] = await db.insert(tags).values({ name: 'old' }).returning();

      expect(await updateTag(admin, tag.id, { name: 'new', tagCategoryId: category.id }, db)).toMatchObject({
        ok: true,
        tag: { name: 'new', tagCategory: { name: 'Genre' } },
      });
      expect(await updateTag(admin, tag.id, { name: 'new', tagCategoryId: null }, db)).toMatchObject({
        ok: true,
        tag: { tagCategory: null },
      });
    });

    it('rejects invalid changes and a category that does not exist', async () => {
      const [tag] = await db.insert(tags).values({ name: 'keep' }).returning();

      expect(await updateTag(admin, tag.id, { name: '' }, db)).toMatchObject({ ok: false });
      expect(await updateTag(admin, tag.id, { name: 'x', tagCategoryId: 123456 }, db)).toEqual({
        ok: false,
        errors: ['Tag category does not exist'],
      });
      expect((await db.select().from(tags))[0].name).toEqual('keep');
    });

    it('is forbidden to non-admins, and 404s for a tag that does not exist', async () => {
      const [tag] = await db.insert(tags).values({ name: 'keep' }).returning();

      expect(await responseStatus(updateTag(notAdmin, tag.id, { name: 'hacked' }, db))).toEqual(403);
      expect(await responseStatus(updateTag(admin, 123456, { name: 'ghost' }, db))).toEqual(404);
      expect((await db.select().from(tags))[0].name).toEqual('keep');
    });
  });

  describe('deleting', () => {
    it('deletes the tag and takes it off the projects that had it', async () => {
      const [brand] = await db.insert(brands).values({ name: 'A', slug: 'a' }).returning();
      const [project] = await db.insert(projects).values({ title: 'One', brandId: brand.id }).returning();
      const [doomed, kept] = await db
        .insert(tags)
        .values([{ name: 'doomed' }, { name: 'kept' }])
        .returning();
      await db.insert(projectsTags).values([
        { projectId: project.id, tagId: doomed.id },
        { projectId: project.id, tagId: kept.id },
      ]);

      await deleteTag(admin, doomed.id, db);

      expect((await db.select().from(tags)).map((tag) => tag.name)).toEqual(['kept']);
      expect(await db.select().from(projectsTags)).toEqual([{ projectId: project.id, tagId: kept.id }]);
    });

    it('is forbidden to non-admins, and 404s for a tag that does not exist', async () => {
      const [tag] = await db.insert(tags).values({ name: 'keep' }).returning();

      expect(await responseStatus(deleteTag(notAdmin, tag.id, db))).toEqual(403);
      expect(await responseStatus(deleteTag(admin, 123456, db))).toEqual(404);
      expect(await db.$count(tags)).toEqual(1);
    });
  });
});

describe('tag autocomplete', () => {
  beforeAll(setupDb);
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  it('finds tags by the start of their name, or of their category’s name, ignoring case', async () => {
    const [genre] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();
    await db
      .insert(tags)
      .values([
        { name: 'horde', tagCategoryId: genre.id },
        { name: 'Heist' },
        { name: 'comedy', tagCategoryId: genre.id },
        { name: 'chorus' },
      ]);

    expect((await autocompleteTags(db, 'h')).map((tag) => tag.name)).toEqual(['Heist', 'horde']);
    expect((await autocompleteTags(db, 'GEN')).map((tag) => tag.name)).toEqual(['comedy', 'horde']);
    expect(await autocompleteTags(db, 'zzz')).toEqual([]);
    expect((await autocompleteTags(db, '')).map((tag) => tag.name)).toEqual(['chorus', 'comedy', 'Heist', 'horde']);
  });

  it('includes each tag’s category, and treats % and _ as ordinary characters', async () => {
    const [genre] = await db.insert(tagCategories).values({ name: 'Genre', color: '#ffff00' }).returning();
    await db.insert(tags).values([{ name: '100%', tagCategoryId: genre.id }, { name: 'a_b' }, { name: 'axb' }]);

    expect(await autocompleteTags(db, '100%')).toEqual([
      {
        id: expect.any(Number),
        name: '100%',
        tagCategory: expect.objectContaining({ name: 'Genre', textColor: '#000000' }),
      },
    ]);
    expect((await autocompleteTags(db, '%')).map((tag) => tag.name)).toEqual([]);
    expect((await autocompleteTags(db, 'a_')).map((tag) => tag.name)).toEqual(['a_b']);
  });

  it('gives at most 25 tags', async () => {
    await db.insert(tags).values(Array.from({ length: 30 }, (_, i) => ({ name: `tag ${String(i).padStart(2, '0')}` })));

    expect(await autocompleteTags(db, 'tag')).toHaveLength(25);
  });
});
