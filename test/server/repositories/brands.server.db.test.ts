// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brandMemberships, brands } from '~/.server/db/schema';
import { brandSubject, loadAbility } from '~/.server/lib/authorization.server';
import {
  approveBrandById,
  brandIsApproved,
  countVisibleBrands,
  visibleBrandsCondition,
} from '~/.server/repositories/brands.server';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { addMember, createBrand, createUser } from '../support/factories';

describe('brands repository', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  describe('who can see which brands', () => {
    it('agrees, for every kind of viewer, with what the ability says', async () => {
      const [siteAdmin, brandAdmin, member, stranger] = await Promise.all([
        createUser({ name: 'Site Admin', admin: true }),
        createUser({ name: 'Brand Admin' }),
        createUser({ name: 'Member' }),
        createUser({ name: 'Stranger' }),
      ]);
      const approved = await createBrand({ name: 'Approved' });
      const pendingOfAdmin = await createBrand({ name: 'Pending Of Admin', approved: false });
      const pendingOfMember = await createBrand({ name: 'Pending Of Member', approved: false });
      const pendingOfNobody = await createBrand({ name: 'Pending Of Nobody', approved: false });
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
        expect(await countVisibleBrands(db, viewer)).toEqual(visibleByAbility.length);
      }
    });

    it('treats approval as what makes a brand public', async () => {
      const approved = await createBrand({ approved: true });
      await createBrand({ approved: false });

      const ids = (await db.select({ id: brands.id }).from(brands).where(brandIsApproved)).map((row) => row.id);

      expect(ids).toEqual([approved.id]);
    });
  });

  describe('approveBrandById', () => {
    it('says whether this call was the one that approved the brand', async () => {
      const brand = await createBrand({ approved: false });

      expect(await approveBrandById(db, brand.id)).toBe(true);
      expect(await approveBrandById(db, brand.id)).toBe(false);
    });

    it('says no for a brand that does not exist', async () => {
      expect(await approveBrandById(db, 123456)).toBe(false);
    });
  });

  it('counts the brands a member can see, including their own pending ones', async () => {
    const member = await createUser();
    const pending = await createBrand({ approved: false });
    await createBrand({ approved: false });
    await createBrand({ approved: true });
    await addMember(pending.id, member.id);

    expect(await countVisibleBrands(db, member)).toEqual(2);
  });
});
