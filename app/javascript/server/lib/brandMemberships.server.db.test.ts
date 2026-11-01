// @vitest-environment node
import { isNotNull } from 'drizzle-orm';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { brandMemberships, brands, users } from '../db/schema';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../test/db';
import { brandSubject, buildAbility, loadAbility } from './authorization.server';
import { acceptInvitation, findInvitation, inviteBrandMember, removeBrandMembership } from './brandMemberships.server';

const isInvitation = isNotNull(brandMemberships.invitationToken);

async function responseStatus(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error instanceof Response ? error.status : error;
  }
  return null;
}

describe('brand memberships', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  async function createUser(name: string) {
    const [user] = await db
      .insert(users)
      .values({ name, email: `${name.toLowerCase().replace(/\W+/g, '.')}@example.com` })
      .returning();
    return user;
  }

  /** A brand with an administrator, an ordinary member, and someone with no connection to it */
  async function setup() {
    const [brandAdmin, member, outsider] = [
      await createUser('Brand Admin'),
      await createUser('Plain Member'),
      await createUser('Outsider'),
    ];
    const [brand] = await db
      .insert(brands)
      .values({ name: 'Cool Games', slug: 'cool-games', approved: true })
      .returning();
    const [adminMembership, memberMembership] = await db
      .insert(brandMemberships)
      .values([
        { brandId: brand.id, userId: brandAdmin.id, admin: true },
        { brandId: brand.id, userId: member.id, admin: false },
      ])
      .returning();
    return { brand, brandAdmin, member, outsider, adminMembership, memberMembership };
  }

  function fakeTransport() {
    return { sendMail: vi.fn().mockResolvedValue(undefined) };
  }

  describe('inviting', () => {
    it('creates an invitation with a secret token and sends the email once', async () => {
      const { brand, brandAdmin } = await setup();
      const transport = fakeTransport();

      const result = await inviteBrandMember(
        await loadAbility(brandAdmin, {}, db),
        brandAdmin,
        brand.id,
        { email: ' New.Person@Example.com ', admin: true },
        { db, transport },
      );

      expect(result.ok).toBe(true);
      const [invitation] = await db.select().from(brandMemberships).where(isInvitation);
      expect(invitation).toMatchObject({
        brandId: brand.id,
        userId: null,
        admin: true,
        invitationEmail: 'New.Person@Example.com',
      });
      expect(invitation.invitationToken).toMatch(/^[A-Za-z0-9_-]{20}$/);

      expect(transport.sendMail).toHaveBeenCalledTimes(1);
      const sent = transport.sendMail.mock.calls[0][0];
      expect(sent).toMatchObject({
        to: 'New.Person@Example.com',
        subject: 'Brand Admin invited you to join Cool Games on Larp Library',
      });
      expect(sent.text).toContain(`/brands/cool-games/invitations/${invitation.invitationToken}`);
      expect(sent.text).toContain('Add and remove members from Cool Games');
    });

    it('gives each invitation its own token', async () => {
      const { brand, brandAdmin } = await setup();
      const ability = await loadAbility(brandAdmin, {}, db);
      const transport = fakeTransport();

      await inviteBrandMember(
        ability,
        brandAdmin,
        brand.id,
        { email: 'a@example.com', admin: false },
        { db, transport },
      );
      await inviteBrandMember(
        ability,
        brandAdmin,
        brand.id,
        { email: 'b@example.com', admin: false },
        { db, transport },
      );

      const tokens = (await db.select().from(brandMemberships).where(isInvitation)).map((row) => row.invitationToken);
      expect(new Set(tokens).size).toEqual(2);
    });

    it('lets a site administrator invite anyone to any brand', async () => {
      const { brand } = await setup();

      const result = await inviteBrandMember(
        buildAbility({ id: 999, admin: true }),
        null,
        brand.id,
        { email: 'a@example.com', admin: false },
        { db, transport: fakeTransport() },
      );

      expect(result.ok).toBe(true);
    });

    it.each([
      [{ email: 'not-an-email', admin: false }],
      [{ email: '', admin: false }],
      [{ admin: false }],
      [{ email: 'a@example.com' }],
    ])('rejects %j', async (input) => {
      const { brand, brandAdmin } = await setup();
      const transport = fakeTransport();

      const result = await inviteBrandMember(await loadAbility(brandAdmin, {}, db), brandAdmin, brand.id, input, {
        db,
        transport,
      });

      expect(result.ok).toBe(false);
      expect(await db.select().from(brandMemberships).where(isInvitation)).toHaveLength(0);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });

    it('is forbidden to ordinary members, outsiders and visitors, and 404s for a brand that does not exist', async () => {
      const { brand, member, outsider } = await setup();
      const transport = fakeTransport();
      const input = { email: 'a@example.com', admin: false };

      for (const ability of [
        await loadAbility(member, {}, db),
        await loadAbility(outsider, {}, db),
        buildAbility(null),
      ]) {
        expect(await responseStatus(inviteBrandMember(ability, null, brand.id, input, { db, transport }))).toEqual(403);
      }
      expect(
        await responseStatus(
          inviteBrandMember(buildAbility({ id: 1, admin: true }), null, 123456, input, { db, transport }),
        ),
      ).toEqual(404);
      expect(await db.select().from(brandMemberships).where(isInvitation)).toHaveLength(0);
      expect(transport.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('removing', () => {
    it('lets a brand administrator remove a member or cancel an invitation', async () => {
      const { brand, brandAdmin, memberMembership } = await setup();
      const [invitation] = await db
        .insert(brandMemberships)
        .values({ brandId: brand.id, userId: null, invitationEmail: 'a@example.com', invitationToken: 'tok' })
        .returning();
      const ability = await loadAbility(brandAdmin, {}, db);

      await removeBrandMembership(ability, memberMembership.id, { db });
      await removeBrandMembership(ability, invitation.id, { db });

      expect(await db.$count(brandMemberships)).toEqual(1);
    });

    it('is forbidden to ordinary members and to administrators of other brands', async () => {
      const { member, memberMembership, adminMembership } = await setup();
      const [otherBrand] = await db.insert(brands).values({ name: 'Other', slug: 'other' }).returning();
      const otherAdmin = await createUser('Other Admin');
      await db.insert(brandMemberships).values({ brandId: otherBrand.id, userId: otherAdmin.id, admin: true });

      expect(
        await responseStatus(removeBrandMembership(await loadAbility(member, {}, db), adminMembership.id, { db })),
      ).toEqual(403);
      expect(
        await responseStatus(removeBrandMembership(await loadAbility(otherAdmin, {}, db), memberMembership.id, { db })),
      ).toEqual(403);
      expect(await responseStatus(removeBrandMembership(buildAbility(null), memberMembership.id, { db }))).toEqual(403);
      expect(await db.$count(brandMemberships)).toEqual(3);
    });

    it('404s for a membership that does not exist', async () => {
      expect(await responseStatus(removeBrandMembership(buildAbility({ id: 1, admin: true }), 123456, { db }))).toEqual(
        404,
      );
      expect(await responseStatus(removeBrandMembership(buildAbility({ id: 1, admin: true }), 'abc', { db }))).toEqual(
        404,
      );
    });
  });

  describe('accepting an invitation', () => {
    async function invitation(admin = false) {
      const context = await setup();
      const [membership] = await db
        .insert(brandMemberships)
        .values({
          brandId: context.brand.id,
          userId: null,
          admin,
          invitationEmail: 'invitee@example.com',
          invitationToken: 'secret-token',
        })
        .returning();
      return { ...context, invitationMembership: membership };
    }

    it('finds the invitation from the brand’s slug and the token', async () => {
      const { brand } = await invitation(true);

      expect(await findInvitation(db, 'cool-games', 'secret-token')).toEqual({
        brandMembership: {
          id: expect.any(Number),
          admin: true,
          brand: { id: brand.id, name: 'Cool Games', slug: 'cool-games' },
        },
      });
    });

    it('404s for the wrong token, the wrong brand, or a token that has been used', async () => {
      const { outsider } = await invitation();
      await acceptInvitation(
        outsider,
        { brandId: (await db.query.brands.findFirst())!.id, invitationToken: 'secret-token' },
        { db },
      );

      expect(await responseStatus(findInvitation(db, 'cool-games', 'secret-token'))).toEqual(404);
      expect(await responseStatus(findInvitation(db, 'cool-games', 'wrong'))).toEqual(404);
      expect(await responseStatus(findInvitation(db, 'no-such-brand', 'secret-token'))).toEqual(404);
    });

    it('makes the signed-in user the member, and uses up the token', async () => {
      const { brand, outsider, invitationMembership } = await invitation(true);

      const result = await acceptInvitation(outsider, { brandId: brand.id, invitationToken: 'secret-token' }, { db });

      expect(result.ok).toBe(true);
      const accepted = await db.query.brandMemberships.findFirst({
        where: (t, { eq }) => eq(t.id, invitationMembership.id),
      });
      expect(accepted).toMatchObject({ userId: outsider.id, admin: true, invitationToken: null });
      // so the new member can now do what the invitation said
      const ability = await loadAbility(outsider, {}, db);
      expect(ability.can('update', brandSubject({ id: brand.id, approved: true }))).toBe(true);
      // and the link doesn't work a second time
      expect(
        await responseStatus(
          acceptInvitation(
            await createUser('Someone Else'),
            { brandId: brand.id, invitationToken: 'secret-token' },
            { db },
          ),
        ),
      ).toEqual(404);
    });

    it('will not make someone a member of a brand they already belong to', async () => {
      const { brand, member } = await invitation();

      const result = await acceptInvitation(member, { brandId: brand.id, invitationToken: 'secret-token' }, { db });

      expect(result).toEqual({ ok: false, errors: ['User is already a member of this brand'] });
      expect(
        (await db.query.brandMemberships.findFirst({ where: (t, { eq }) => eq(t.invitationToken, 'secret-token') }))
          ?.userId,
      ).toBeNull();
    });

    it('needs someone signed in, and the right token', async () => {
      const { brand, outsider } = await invitation();

      expect(
        await responseStatus(acceptInvitation(null, { brandId: brand.id, invitationToken: 'secret-token' }, { db })),
      ).toEqual(403);
      expect(
        await responseStatus(acceptInvitation(outsider, { brandId: brand.id, invitationToken: 'wrong' }, { db })),
      ).toEqual(404);
      expect(
        await responseStatus(acceptInvitation(outsider, { brandId: 'abc', invitationToken: 'secret-token' }, { db })),
      ).toEqual(404);
      expect(
        await responseStatus(acceptInvitation(outsider, { brandId: brand.id, invitationToken: 5 }, { db })),
      ).toEqual(404);
    });
  });
});
