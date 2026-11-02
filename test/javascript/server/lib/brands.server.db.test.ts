// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { brandMemberships, brands, projects, users } from '~/server/db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { brandSubject, buildAbility, loadAbility } from '~/server/lib/authorization.server';
import {
  approveBrand,
  BRANDS_PAGE_SIZE,
  findBrandPage,
  listBrands,
  listUnapprovedBrands,
  visibleBrandsCondition,
} from '~/server/lib/brands.server';

async function responseStatus(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error instanceof Response ? error.status : error;
  }
  return null;
}

describe('brands', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  async function createUser(name: string, extra: Partial<typeof users.$inferInsert> = {}) {
    const [user] = await db
      .insert(users)
      .values({ name, email: `${name.toLowerCase().replace(/\W+/g, '.')}@example.com`, ...extra })
      .returning();
    return user;
  }

  async function createBrand(name: string, values: Partial<typeof brands.$inferInsert> = {}) {
    const [brand] = await db
      .insert(brands)
      .values({ name, slug: name.toLowerCase().replace(/\W+/g, '-'), approved: true, ...values })
      .returning();
    return brand;
  }

  async function createProject(brandId: number, title: string) {
    const [project] = await db.insert(projects).values({ brandId, title }).returning();
    return project;
  }

  describe('who can see which brands', () => {
    it('agrees, for every kind of viewer, with what the ability says', async () => {
      const [siteAdmin, brandAdmin, member, stranger] = await Promise.all([
        createUser('Site Admin', { admin: true }),
        createUser('Brand Admin'),
        createUser('Member'),
        createUser('Stranger'),
      ]);
      const approved = await createBrand('Approved');
      const pendingOfAdmin = await createBrand('Pending Of Admin', { approved: false });
      const pendingOfMember = await createBrand('Pending Of Member', { approved: false });
      const pendingOfNobody = await createBrand('Pending Of Nobody', { approved: false });
      await db.insert(brandMemberships).values([
        { brandId: pendingOfAdmin.id, userId: brandAdmin.id, admin: true },
        { brandId: pendingOfMember.id, userId: member.id, admin: false },
        // an unaccepted invitation to a brand gives its invitee nothing yet
        { brandId: pendingOfNobody.id, userId: null, invitationEmail: 'invitee@example.com' },
      ]);
      const everyBrand = [approved, pendingOfAdmin, pendingOfMember, pendingOfNobody];

      for (const viewer of [null, siteAdmin, brandAdmin, member, stranger]) {
        const ability = await loadAbility(viewer, {}, db);
        const visibleBySql = (
          await db.select({ id: brands.id }).from(brands).where(visibleBrandsCondition(viewer))
        ).map((row) => row.id);
        const visibleByAbility = everyBrand
          .filter((brand) => ability.can('read', brandSubject(brand)))
          .map((brand) => brand.id);

        expect(visibleBySql.sort(), `as ${viewer?.name ?? 'a signed-out visitor'}`).toEqual(visibleByAbility.sort());
      }
    });
  });

  describe('listing', () => {
    it('lists the brands a viewer can see, those with the most larps first', async () => {
      const busy = await createBrand('Busy');
      const quiet = await createBrand('Quiet');
      const alsoQuiet = await createBrand('Also Quiet');
      await createBrand('Hidden', { approved: false });
      for (const title of ['One', 'Two', 'Three']) await createProject(busy.id, title);
      await createProject(quiet.id, 'Solo');
      await createProject(alsoQuiet.id, 'Duo A');
      await createProject(alsoQuiet.id, 'Duo B');

      const page = await listBrands(db, null);

      expect(page.brands.map((brand) => [brand.name, brand.projectCount])).toEqual([
        ['Busy', 3],
        ['Also Quiet', 2],
        ['Quiet', 1],
      ]);
      expect(page.totalCount).toEqual(3);
    });

    it('shows a member their own unapproved brand, and a site administrator every one', async () => {
      const member = await createUser('Member');
      const siteAdmin = await createUser('Site Admin', { admin: true });
      const own = await createBrand('Own Pending', { approved: false });
      await createBrand('Someone Elses Pending', { approved: false });
      await db.insert(brandMemberships).values({ brandId: own.id, userId: member.id });

      expect((await listBrands(db, member)).brands.map((brand) => brand.name)).toEqual(['Own Pending']);
      expect((await listBrands(db, siteAdmin)).totalCount).toEqual(2);
      expect((await listBrands(db, null)).totalCount).toEqual(0);
    });

    it('sends only the start of a long description', async () => {
      await createBrand('Wordy', { description: 'x'.repeat(800) });

      expect((await listBrands(db, null)).brands[0].description).toHaveLength(500);
    });

    it('pages through the results', async () => {
      for (let i = 0; i < BRANDS_PAGE_SIZE + 3; i++) {
        await createBrand(`Brand ${String(i).padStart(3, '0')}`);
      }

      const first = await listBrands(db, null);
      const second = await listBrands(db, null, { offset: BRANDS_PAGE_SIZE });

      expect(first.brands).toHaveLength(BRANDS_PAGE_SIZE);
      expect(second.brands).toHaveLength(3);
      expect(second.totalCount).toEqual(BRANDS_PAGE_SIZE + 3);
      expect(new Set([...first.brands, ...second.brands].map((brand) => brand.id)).size).toEqual(BRANDS_PAGE_SIZE + 3);
    });
  });

  describe('the unapproved list', () => {
    it('lists unapproved brands alphabetically with their creators, for administrators', async () => {
      const creator = await createUser('Pat Smith');
      await createBrand('zebra pending', { approved: false, creatorId: creator.id });
      await createBrand('Aardvark Pending', { approved: false });
      await createBrand('Already Approved');

      const list = await listUnapprovedBrands(db, buildAbility({ id: 1, admin: true }));

      expect(list.map((brand) => brand.name)).toEqual(['Aardvark Pending', 'zebra pending']);
      expect(list[1].creator).toEqual({ name: 'Pat Smith', email: 'pat.smith@example.com' });
      expect(list[0].creator).toBeNull();
    });

    it('is for administrators only', async () => {
      expect(await responseStatus(listUnapprovedBrands(db, buildAbility({ id: 2, admin: false })))).toEqual(403);
      expect(await responseStatus(listUnapprovedBrands(db, buildAbility(null)))).toEqual(403);
    });
  });

  describe('a brand’s page', () => {
    it('shows the brand and a page of its projects, alphabetically', async () => {
      const brand = await createBrand('Cool Games', { description: 'We make games' });
      await createProject(brand.id, 'The Zebra');
      await createProject(brand.id, 'A Bear Hunt');
      const other = await createBrand('Other');
      await createProject(other.id, 'Not Ours');

      const page = await findBrandPage(db, buildAbility(null), 'cool-games');

      expect(page.brand).toMatchObject({ name: 'Cool Games', description: 'We make games', approved: true });
      expect(page.projects.map((project) => project.title)).toEqual(['A Bear Hunt', 'The Zebra']);
      expect(page.totalCount).toEqual(2);
    });

    it('tells the page what the viewer can do', async () => {
      const admin = await createUser('Site Admin', { admin: true });
      const member = await createUser('Member');
      const brand = await createBrand('Cool Games');
      await db.insert(brandMemberships).values({ brandId: brand.id, userId: member.id, admin: false });

      const asVisitor = (await findBrandPage(db, buildAbility(null), 'cool-games')).brand;
      const asMember = (await findBrandPage(db, await loadAbility(member, {}, db), 'cool-games')).brand;
      const asAdmin = (await findBrandPage(db, await loadAbility(admin, {}, db), 'cool-games')).brand;

      expect([asVisitor, asMember, asAdmin].map((b) => [b.currentUserCanEdit, b.currentUserCanCreateProjects])).toEqual(
        [
          [false, false],
          [false, true],
          [true, true],
        ],
      );
    });

    it('hides an unapproved brand from everyone but its members and site administrators, as if it did not exist', async () => {
      const member = await createUser('Member');
      const outsider = await createUser('Outsider');
      const brand = await createBrand('Pending Games', { approved: false });
      await db.insert(brandMemberships).values({ brandId: brand.id, userId: member.id });

      expect(await responseStatus(findBrandPage(db, buildAbility(null), 'pending-games'))).toEqual(404);
      expect(await responseStatus(findBrandPage(db, await loadAbility(outsider, {}, db), 'pending-games'))).toEqual(
        404,
      );
      expect((await findBrandPage(db, await loadAbility(member, {}, db), 'pending-games')).brand.approved).toBe(false);
      expect(await responseStatus(findBrandPage(db, buildAbility(null), 'no-such-brand'))).toEqual(404);
    });

    it('pages through a brand’s projects', async () => {
      const brand = await createBrand('Prolific');
      for (let i = 0; i < 28; i++) await createProject(brand.id, `Game ${String(i).padStart(2, '0')}`);

      const first = await findBrandPage(db, buildAbility(null), 'prolific');
      const second = await findBrandPage(db, buildAbility(null), 'prolific', { offset: 25 });

      expect(first.projects).toHaveLength(25);
      expect(second.projects.map((project) => project.title)).toEqual(['Game 25', 'Game 26', 'Game 27']);
      expect(second.totalCount).toEqual(28);
    });
  });

  describe('approving', () => {
    const admin = buildAbility({ id: 1, admin: true });

    function fakeTransport() {
      return { sendMail: vi.fn().mockResolvedValue(undefined) };
    }

    it('approves the brand and emails its creator', async () => {
      const creator = await createUser('Pat Smith');
      const brand = await createBrand('Pending Games', { approved: false, creatorId: creator.id });
      const transport = fakeTransport();

      await approveBrand(admin, brand.id, { db, transport });

      expect((await db.select().from(brands))[0].approved).toBe(true);
      expect(transport.sendMail).toHaveBeenCalledTimes(1);
      expect(transport.sendMail.mock.calls[0][0]).toMatchObject({
        to: { name: 'Pat Smith', address: 'pat.smith@example.com' },
        subject: 'Pending Games is approved on Larp Library!',
        html: expect.stringContaining('/brands/pending-games'),
      });
    });

    it('does not email twice when a brand is approved again', async () => {
      const creator = await createUser('Pat Smith');
      const brand = await createBrand('Pending Games', { approved: false, creatorId: creator.id });
      const transport = fakeTransport();

      await approveBrand(admin, brand.id, { db, transport });
      await approveBrand(admin, brand.id, { db, transport });

      expect(transport.sendMail).toHaveBeenCalledTimes(1);
    });

    it('still approves a brand whose creator is unknown, without emailing anyone', async () => {
      const brand = await createBrand('Orphan Games', { approved: false });
      const transport = fakeTransport();

      await approveBrand(admin, brand.id, { db, transport });

      expect((await db.select().from(brands))[0].approved).toBe(true);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });

    it('still approves the brand when the email cannot be sent', async () => {
      const creator = await createUser('Pat Smith');
      const brand = await createBrand('Pending Games', { approved: false, creatorId: creator.id });
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

      await approveBrand(admin, brand.id, {
        db,
        transport: { sendMail: vi.fn().mockRejectedValue(new Error('SES down')) },
      });

      expect((await db.select().from(brands))[0].approved).toBe(true);
      expect(errorLog).toHaveBeenCalled();
      errorLog.mockRestore();
    });

    it('is forbidden to everyone but site administrators, and 404s for a brand that does not exist', async () => {
      const brand = await createBrand('Pending Games', { approved: false });
      const brandAdmin = await createUser('Brand Admin');
      await db.insert(brandMemberships).values({ brandId: brand.id, userId: brandAdmin.id, admin: true });
      const transport = fakeTransport();

      expect(
        await responseStatus(approveBrand(await loadAbility(brandAdmin, {}, db), brand.id, { db, transport })),
      ).toEqual(403);
      expect(await responseStatus(approveBrand(buildAbility(null), brand.id, { db, transport }))).toEqual(403);
      expect(await responseStatus(approveBrand(admin, 123456, { db, transport }))).toEqual(404);
      expect(await responseStatus(approveBrand(admin, 'abc', { db, transport }))).toEqual(404);
      expect((await db.select().from(brands))[0].approved).toBe(false);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });
  });
});
