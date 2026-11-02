// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { tagCategories, tags } from '~/.server/db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { buildAbility } from '~/.server/lib/authorization.server';
import {
  autocompleteTagCategories,
  createTagCategory,
  deleteTagCategory,
  findTagCategory,
  listTagCategories,
  updateTagCategory,
} from '~/.server/lib/tagCategories.server';

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

describe('tag categories', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  describe('reading', () => {
    it('lists the categories alphabetically regardless of case, with their display colors filled in', async () => {
      await db
        .insert(tagCategories)
        .values([{ name: 'genre', color: '#ffff00' }, { name: 'Element' }, { name: 'Zone' }]);

      const categories = await listTagCategories(db);

      expect(categories.map((category) => category.name)).toEqual(['Element', 'genre', 'Zone']);
      expect(categories[0]).toMatchObject({ color: '#777777', textColor: '#ffffff', icon: 'tag' });
      expect(categories[1]).toMatchObject({ color: '#ffff00', textColor: '#000000' });
    });

    it('finds a category with its tags', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre', icon: 'star' }).returning();
      await db
        .insert(tags)
        .values([
          { name: 'drama', tagCategoryId: category.id },
          { name: 'Comedy', tagCategoryId: category.id },
          { name: 'elsewhere' },
        ]);

      const found = await findTagCategory(db, category.id);

      expect(found?.tagCategory).toMatchObject({ id: category.id, name: 'Genre', icon: 'star' });
      expect(found?.tags.map((tag) => tag.name)).toEqual(['Comedy', 'drama']);
    });

    it('returns null for a category that does not exist', async () => {
      expect(await findTagCategory(db, 123456)).toBeNull();
    });

    it('autocompletes by the start of the name, ignoring case', async () => {
      await db.insert(tagCategories).values([{ name: 'Genre' }, { name: 'General' }, { name: 'Element' }]);

      expect((await autocompleteTagCategories(db, 'gen')).map((category) => category.name)).toEqual([
        'General',
        'Genre',
      ]);
      expect(await autocompleteTagCategories(db, 'x')).toEqual([]);
      expect(await autocompleteTagCategories(db, '')).toHaveLength(3);
    });

    it('treats % and _ in what was typed as ordinary characters', async () => {
      await db.insert(tagCategories).values([{ name: '100%' }, { name: 'a_b' }, { name: 'axb' }]);

      expect((await autocompleteTagCategories(db, '%')).map((category) => category.name)).toEqual([]);
      expect((await autocompleteTagCategories(db, '100%')).map((category) => category.name)).toEqual(['100%']);
      expect((await autocompleteTagCategories(db, 'a_')).map((category) => category.name)).toEqual(['a_b']);
    });
  });

  describe('creating', () => {
    it('creates a category', async () => {
      const result = await createTagCategory(admin, { name: ' Genre ', color: '#3366cc', icon: 'star-fill' }, db);

      expect(result).toMatchObject({ ok: true, tagCategory: { name: 'Genre', color: '#3366cc', icon: 'star-fill' } });
      expect(await db.$count(tagCategories)).toEqual(1);
    });

    it('stores a blank color or icon as unset, so the defaults apply', async () => {
      const result = await createTagCategory(admin, { name: 'Plain', color: '', icon: ' ' }, db);

      expect(result).toMatchObject({ ok: true, tagCategory: { color: '#777777', icon: 'tag' } });
      const [row] = await db.select().from(tagCategories);
      expect(row.color).toBeNull();
      expect(row.icon).toBeNull();
    });

    it.each([
      [{ name: '' }, "Name can't be blank"],
      [{ name: '   ' }, "Name can't be blank"],
      [{}, 'Invalid input'],
      [{ name: 'X', color: 'red' }, 'Color is invalid'],
      [{ name: 'X', color: '#12345' }, 'Color is invalid'],
    ])('rejects %j', async (input, message) => {
      const result = await createTagCategory(admin, input, db);

      expect(result).toMatchObject({ ok: false });
      expect(result.ok === false && result.errors.join()).toContain(message);
      expect(await db.$count(tagCategories)).toEqual(0);
    });

    it('rejects a name that is already taken', async () => {
      await createTagCategory(admin, { name: 'Genre' }, db);

      expect(await createTagCategory(admin, { name: 'Genre' }, db)).toEqual({
        ok: false,
        errors: ['Name has already been taken'],
      });
      expect(await db.$count(tagCategories)).toEqual(1);
    });

    it.each([
      ['a signed-in user who is not an admin', notAdmin],
      ['a signed-out visitor', signedOut],
    ])('is forbidden to %s', async (_, ability) => {
      expect(await responseStatus(createTagCategory(ability, { name: 'Genre' }, db))).toEqual(403);
      expect(await db.$count(tagCategories)).toEqual(0);
    });
  });

  describe('updating', () => {
    it('changes a category, and can clear its color and icon', async () => {
      const [category] = await db
        .insert(tagCategories)
        .values({ name: 'Genre', color: '#3366cc', icon: 'star' })
        .returning();

      const result = await updateTagCategory(admin, category.id, { name: 'Genres', color: '', icon: '' }, db);

      expect(result).toMatchObject({ ok: true, tagCategory: { name: 'Genres', color: '#777777', icon: 'tag' } });
      const [row] = await db.select().from(tagCategories);
      expect(row).toMatchObject({ name: 'Genres', color: null, icon: null });
    });

    it('rejects invalid changes and a name taken by another category', async () => {
      const [first, second] = await db
        .insert(tagCategories)
        .values([{ name: 'First' }, { name: 'Second' }])
        .returning();

      expect(await updateTagCategory(admin, first.id, { name: '' }, db)).toMatchObject({ ok: false });
      expect(await updateTagCategory(admin, first.id, { name: 'Second' }, db)).toEqual({
        ok: false,
        errors: ['Name has already been taken'],
      });
      expect((await db.query.tagCategories.findFirst({ where: (t, { eq }) => eq(t.id, second.id) }))?.name).toEqual(
        'Second',
      );
    });

    it('is forbidden to non-admins, and 404s for a category that does not exist', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();

      expect(await responseStatus(updateTagCategory(notAdmin, category.id, { name: 'Hacked' }, db))).toEqual(403);
      expect(await responseStatus(updateTagCategory(admin, 123456, { name: 'Ghost' }, db))).toEqual(404);
      expect((await db.select().from(tagCategories))[0].name).toEqual('Genre');
    });
  });

  describe('deleting', () => {
    it('deletes the category and leaves its tags without one', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();
      const [tag] = await db.insert(tags).values({ name: 'comedy', tagCategoryId: category.id }).returning();

      await deleteTagCategory(admin, category.id, db);

      expect(await db.$count(tagCategories)).toEqual(0);
      const [remaining] = await db.select().from(tags);
      expect(remaining).toMatchObject({ id: tag.id, tagCategoryId: null });
    });

    it('is forbidden to non-admins, and 404s for a category that does not exist', async () => {
      const [category] = await db.insert(tagCategories).values({ name: 'Genre' }).returning();

      expect(await responseStatus(deleteTagCategory(notAdmin, category.id, db))).toEqual(403);
      expect(await responseStatus(deleteTagCategory(admin, 123456, db))).toEqual(404);
      expect(await db.$count(tagCategories)).toEqual(1);
    });
  });
});
