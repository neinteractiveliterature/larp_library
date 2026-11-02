// @vitest-environment node
import { eq } from 'drizzle-orm';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { brandMemberships, brands, users } from '~/server/db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { buildAbility, loadAbility } from '~/server/lib/authorization.server';
import { createBrand, findBrandForEditing, listUserBrands, updateBrand } from '~/server/lib/brands.server';

async function responseStatus(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error instanceof Response ? error.status : error;
  }
  return null;
}

describe('creating and editing brands', () => {
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

  function fakeTransport() {
    return { sendMail: vi.fn().mockResolvedValue(undefined) };
  }

  describe('createBrand', () => {
    it('creates an unapproved brand, makes its creator its administrator, and emails the site administrators', async () => {
      const creator = await createUser('Pat Smith');
      await createUser('Admin One', { admin: true });
      await createUser('Admin Two', { admin: true });
      await createUser('Not An Admin');
      const transport = fakeTransport();

      const result = await createBrand(
        buildAbility(creator),
        creator,
        { name: ' Team No Pants ', description: 'We make games' },
        { db, transport },
      );

      expect(result).toMatchObject({ ok: true, brand: { slug: 'team-no-pants' } });
      const [brand] = await db.select().from(brands);
      expect(brand).toMatchObject({
        name: 'Team No Pants',
        slug: 'team-no-pants',
        description: 'We make games',
        approved: false,
        creatorId: creator.id,
      });
      const [membership] = await db.select().from(brandMemberships);
      expect(membership).toMatchObject({ brandId: brand.id, userId: creator.id, admin: true, invitationToken: null });

      expect(transport.sendMail).toHaveBeenCalledTimes(1);
      expect(transport.sendMail.mock.calls[0][0]).toMatchObject({
        to: [
          { name: 'Admin One', address: 'admin.one@example.com' },
          { name: 'Admin Two', address: 'admin.two@example.com' },
        ],
        subject: 'New brand for approval on Larp Library: Team No Pants',
        text: expect.stringContaining('Pat Smith has submitted a brand called Team No Pants'),
      });
    });

    it('still creates the brand when there is no administrator to email, or the email cannot be sent', async () => {
      const creator = await createUser('Pat Smith');
      await createUser('Admin', { admin: true });
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await createBrand(
        buildAbility(creator),
        creator,
        { name: 'Resilient' },
        {
          db,
          transport: { sendMail: vi.fn().mockRejectedValue(new Error('SES down')) },
        },
      );

      expect(result.ok).toBe(true);
      expect(await db.$count(brands)).toEqual(1);
      expect(errorLog).toHaveBeenCalled();
      errorLog.mockRestore();
    });

    it.each([
      [{ name: '' }, "Name can't be blank"],
      [{ name: '   ' }, "Name can't be blank"],
      [{}, 'Invalid input'],
      [{ name: '!!!' }, 'Name must include at least one letter or number'],
      [{ name: '日本のゲーム' }, 'Name must include at least one letter or number'],
      [{ name: 'New' }, 'Slug is reserved'],
      [{ name: 'Unapproved' }, 'Slug is reserved'],
      [{ name: 'Approve!' }, 'Slug is reserved'],
    ])('rejects %j', async (input, message) => {
      const creator = await createUser('Pat Smith');
      const transport = fakeTransport();

      const result = await createBrand(buildAbility(creator), creator, input, { db, transport });

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.errors.join()).toContain(message);
      expect(await db.$count(brands)).toEqual(0);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });

    it('rejects a name that is already taken, and a different name that makes the same slug', async () => {
      const creator = await createUser('Pat Smith');
      const transport = fakeTransport();
      await createBrand(buildAbility(creator), creator, { name: 'Cool Games' }, { db, transport });
      transport.sendMail.mockClear();

      expect(await createBrand(buildAbility(creator), creator, { name: 'Cool Games' }, { db, transport })).toEqual({
        ok: false,
        errors: ['Name has already been taken.'],
      });
      expect(await createBrand(buildAbility(creator), creator, { name: 'Cool  Games!' }, { db, transport })).toEqual({
        ok: false,
        errors: ['Slug has already been taken.  Please choose a different name.'],
      });
      expect(await db.$count(brands)).toEqual(1);
      // and a failed creation leaves no half-made brand, with no membership or email
      expect(await db.$count(brandMemberships)).toEqual(1);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });

    it('is forbidden to a signed-out visitor', async () => {
      const creator = await createUser('Pat Smith');

      expect(await responseStatus(createBrand(buildAbility(null), creator, { name: 'Nope' }, { db }))).toEqual(403);
      expect(await db.$count(brands)).toEqual(0);
    });
  });

  describe('updateBrand', () => {
    async function brandWithAdmin() {
      const brandAdmin = await createUser('Brand Admin');
      const [brand] = await db
        .insert(brands)
        .values({ name: 'Old Name', slug: 'old-name', approved: true })
        .returning();
      await db.insert(brandMemberships).values({ brandId: brand.id, userId: brandAdmin.id, admin: true });
      return { brand, brandAdmin };
    }

    it('changes the name and description but not the slug', async () => {
      const { brand, brandAdmin } = await brandWithAdmin();

      const result = await updateBrand(
        await loadAbility(brandAdmin, {}, db),
        brand.id,
        { name: 'New Name', description: 'Fresh words' },
        { db },
      );

      expect(result).toMatchObject({ ok: true, brand: { slug: 'old-name' } });
      expect((await db.select().from(brands))[0]).toMatchObject({
        name: 'New Name',
        slug: 'old-name',
        description: 'Fresh words',
      });
    });

    it('lets a site administrator change any brand', async () => {
      const { brand } = await brandWithAdmin();

      expect(
        await updateBrand(buildAbility({ id: 999, admin: true }), brand.id, { name: 'Edited' }, { db }),
      ).toMatchObject({
        ok: true,
      });
    });

    it('rejects invalid changes and a name another brand has', async () => {
      const { brand, brandAdmin } = await brandWithAdmin();
      await db.insert(brands).values({ name: 'Taken', slug: 'taken' });
      const ability = await loadAbility(brandAdmin, {}, db);

      expect(await updateBrand(ability, brand.id, { name: '' }, { db })).toMatchObject({ ok: false });
      expect(await updateBrand(ability, brand.id, { name: 'Taken' }, { db })).toEqual({
        ok: false,
        errors: ['Name has already been taken.'],
      });
      expect((await db.select().from(brands).where(eq(brands.id, brand.id)))[0].name).toEqual('Old Name');
    });

    it('is forbidden to ordinary members, outsiders and visitors, and 404s for a brand that does not exist', async () => {
      const { brand } = await brandWithAdmin();
      const member = await createUser('Plain Member');
      const outsider = await createUser('Outsider');
      await db.insert(brandMemberships).values({ brandId: brand.id, userId: member.id, admin: false });

      for (const ability of [
        await loadAbility(member, {}, db),
        await loadAbility(outsider, {}, db),
        buildAbility(null),
      ]) {
        expect(await responseStatus(updateBrand(ability, brand.id, { name: 'Hacked' }, { db }))).toEqual(403);
      }
      expect(
        await responseStatus(updateBrand(buildAbility({ id: 1, admin: true }), 123456, { name: 'x' }, { db })),
      ).toEqual(404);
      expect((await db.select().from(brands))[0].name).toEqual('Old Name');
    });
  });

  describe('findBrandForEditing', () => {
    it('gives a brand administrator the brand with its members and pending invitations', async () => {
      const brandAdmin = await createUser('Brand Admin');
      const member = await createUser('Plain Member');
      const [brand] = await db
        .insert(brands)
        .values({ name: 'Cool Games', slug: 'cool-games', approved: false })
        .returning();
      await db.insert(brandMemberships).values([
        { brandId: brand.id, userId: brandAdmin.id, admin: true },
        { brandId: brand.id, userId: member.id, admin: false },
        {
          brandId: brand.id,
          userId: null,
          admin: false,
          invitationEmail: 'invitee@example.com',
          invitationToken: 'tok',
        },
      ]);

      const data = await findBrandForEditing(db, await loadAbility(brandAdmin, {}, db), 'cool-games');

      expect(data.brand).toMatchObject({ name: 'Cool Games', approved: false, currentUserCanManageMemberships: true });
      expect(data.brandMemberships).toEqual([
        {
          id: expect.any(Number),
          admin: true,
          invitationEmail: null,
          user: { id: brandAdmin.id, name: 'Brand Admin', email: 'brand.admin@example.com' },
        },
        {
          id: expect.any(Number),
          admin: false,
          invitationEmail: null,
          user: { id: member.id, name: 'Plain Member', email: 'plain.member@example.com' },
        },
        { id: expect.any(Number), admin: false, invitationEmail: 'invitee@example.com', user: null },
      ]);
    });

    it('is forbidden to members who are not administrators, and a 404 to anyone who cannot see the brand', async () => {
      const member = await createUser('Plain Member');
      const outsider = await createUser('Outsider');
      const [pending] = await db
        .insert(brands)
        .values({ name: 'Pending', slug: 'pending', approved: false })
        .returning();
      const [approved] = await db
        .insert(brands)
        .values({ name: 'Approved', slug: 'approved', approved: true })
        .returning();
      await db.insert(brandMemberships).values([
        { brandId: pending.id, userId: member.id, admin: false },
        { brandId: approved.id, userId: member.id, admin: false },
      ]);

      expect(await responseStatus(findBrandForEditing(db, await loadAbility(member, {}, db), 'approved'))).toEqual(403);
      // an approved brand is visible to everyone, so the outsider is simply not allowed to edit it
      expect(await responseStatus(findBrandForEditing(db, await loadAbility(outsider, {}, db), 'approved'))).toEqual(
        403,
      );
      // an unapproved brand is invisible to them
      expect(await responseStatus(findBrandForEditing(db, await loadAbility(outsider, {}, db), 'pending'))).toEqual(
        404,
      );
      expect(await responseStatus(findBrandForEditing(db, buildAbility(null), 'no-such-brand'))).toEqual(404);
    });
  });

  it('lists the brands a user belongs to alphabetically', async () => {
    const user = await createUser('Pat Smith');
    const [zebra, aardvark, other] = await db
      .insert(brands)
      .values([
        { name: 'zebra games', slug: 'zebra-games' },
        { name: 'Aardvark Games', slug: 'aardvark-games' },
        { name: 'Not Mine', slug: 'not-mine' },
      ])
      .returning();
    await db.insert(brandMemberships).values([
      { brandId: zebra.id, userId: user.id },
      { brandId: aardvark.id, userId: user.id },
    ]);
    expect(other.id).toBeDefined();

    expect((await listUserBrands(db, user.id)).map((brand) => brand.name)).toEqual(['Aardvark Games', 'zebra games']);
    expect(await listUserBrands(db, 999999)).toEqual([]);
  });
});
