// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brands, projectPromotions, projects } from '~/.server/db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { buildAbility } from '~/.server/lib/authorization.server';
import {
  findProjectsToPromote,
  listProjectPromotions,
  promoteProject,
  unpromoteProject,
} from '~/.server/lib/projectPromotions.server';

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

describe('project promotions', () => {
  let approvedBrandId: number;
  let unapprovedBrandId: number;

  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(async () => {
    await resetDb();
    const [approved, unapproved] = await db
      .insert(brands)
      .values([
        { name: 'Approved', slug: 'approved', approved: true },
        { name: 'Unapproved', slug: 'unapproved', approved: false },
      ])
      .returning();
    approvedBrandId = approved.id;
    unapprovedBrandId = unapproved.id;
  });
  afterEach(rollbackDb);

  async function createProject(title: string, brandId = approvedBrandId) {
    const [project] = await db.insert(projects).values({ title, brandId }).returning();
    return project;
  }

  it('lists every promotion alphabetically by project title, including unapproved brands’', async () => {
    const zebra = await createProject('Zebra');
    const aardvark = await createProject('Aardvark', unapprovedBrandId);
    await db.insert(projectPromotions).values([{ projectId: zebra.id }, { projectId: aardvark.id }]);

    const promotions = await listProjectPromotions(db);

    expect(promotions.map((promotion) => promotion.project.title)).toEqual(['Aardvark', 'Zebra']);
    expect(promotions[0].project.brand).toEqual({ slug: 'unapproved' });
    expect(promotions[0].createdAt).toBeInstanceOf(Date);
  });

  describe('promoting', () => {
    it('promotes a project', async () => {
      const project = await createProject('Heist');

      const result = await promoteProject(admin, project.id, db);

      expect(result.ok).toBe(true);
      expect((await db.select().from(projectPromotions)).map((row) => row.projectId)).toEqual([project.id]);
    });

    it('will not promote the same project twice', async () => {
      const project = await createProject('Heist');
      await promoteProject(admin, project.id, db);

      expect(await promoteProject(admin, project.id, db)).toEqual({
        ok: false,
        errors: ['Project is already being promoted.'],
      });
      expect(await db.$count(projectPromotions)).toEqual(1);
    });

    it('404s for a project that does not exist, and rejects a missing or malformed id', async () => {
      expect(await responseStatus(promoteProject(admin, 123456, db))).toEqual(404);
      expect(await promoteProject(admin, undefined, db)).toMatchObject({ ok: false });
      expect(await promoteProject(admin, 'abc', db)).toMatchObject({ ok: false });
      expect(await db.$count(projectPromotions)).toEqual(0);
    });

    it.each([
      ['a signed-in user who is not an admin', notAdmin],
      ['a signed-out visitor', signedOut],
    ])('is forbidden to %s', async (_, ability) => {
      const project = await createProject('Heist');

      expect(await responseStatus(promoteProject(ability, project.id, db))).toEqual(403);
      expect(await db.$count(projectPromotions)).toEqual(0);
    });
  });

  describe('unpromoting', () => {
    it('stops promoting a project, leaving the others', async () => {
      const [one, two] = [await createProject('One'), await createProject('Two')];
      await db.insert(projectPromotions).values([{ projectId: one.id }, { projectId: two.id }]);

      await unpromoteProject(admin, one.id, db);

      expect((await db.select().from(projectPromotions)).map((row) => row.projectId)).toEqual([two.id]);
    });

    it('is forbidden to non-admins, and 404s for a project that is not promoted', async () => {
      const project = await createProject('Heist');
      await db.insert(projectPromotions).values({ projectId: project.id });

      expect(await responseStatus(unpromoteProject(notAdmin, project.id, db))).toEqual(403);
      expect(await responseStatus(unpromoteProject(admin, 123456, db))).toEqual(404);
      expect(await responseStatus(unpromoteProject(admin, 'abc', db))).toEqual(404);
      expect(await db.$count(projectPromotions)).toEqual(1);
    });
  });

  describe('finding projects to promote', () => {
    it('finds visible projects by what was typed, and none from unapproved brands', async () => {
      await createProject('Heist Night');
      await createProject('Secret Heist', unapprovedBrandId);
      await createProject('Gardening');

      const found = await findProjectsToPromote(db, admin, 'heist');

      expect(found.map((project) => project.title)).toEqual(['Heist Night']);
    });

    it('lists the first projects when nothing has been typed', async () => {
      await createProject('Alpha');
      await createProject('Beta');

      expect((await findProjectsToPromote(db, admin, '')).map((project) => project.title)).toEqual(['Alpha', 'Beta']);
    });

    it('is for administrators only', async () => {
      expect(await responseStatus(findProjectsToPromote(db, notAdmin, 'x'))).toEqual(403);
    });
  });
});
