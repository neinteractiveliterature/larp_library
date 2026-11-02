// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { brandMemberships, brands, users } from '~/.server/db/schema';
import { db, resetDb, rollbackDb, setupDb, teardownDb } from '../support/db';
import { brandSubject, brandMembershipSubject, loadAbility, projectSubject } from '~/.server/lib/authorization.server';

describe('loadAbility, against the database', () => {
  beforeAll(setupDb);
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  it("finds a user's brand memberships and builds their ability from them", async () => {
    const [member, other] = await db
      .insert(users)
      .values([
        { email: 'member@example.com', name: 'Member' },
        { email: 'other@example.com', name: 'Other' },
      ])
      .returning();
    const [adminBrand, memberBrand, strangerBrand] = await db
      .insert(brands)
      .values([
        { name: 'Admin Brand', slug: 'admin-brand', creatorId: member.id },
        { name: 'Member Brand', slug: 'member-brand' },
        { name: 'Stranger Brand', slug: 'stranger-brand' },
      ])
      .returning();
    await db.insert(brandMemberships).values([
      { userId: member.id, brandId: adminBrand.id, admin: true },
      { userId: member.id, brandId: memberBrand.id, admin: false },
      // someone else's memberships, and an invitation nobody has accepted yet, grant this user nothing
      { userId: other.id, brandId: strangerBrand.id, admin: true },
      { userId: null, brandId: strangerBrand.id, admin: true, invitationEmail: 'invitee@example.com' },
    ]);

    const ability = await loadAbility(member, {}, db);

    // all three brands are unapproved, so these can only come from membership
    expect(ability.can('read', brandSubject({ id: adminBrand.id, approved: false }))).toBe(true);
    expect(ability.can('read', brandSubject({ id: memberBrand.id, approved: false }))).toBe(true);
    expect(ability.can('read', brandSubject({ id: strangerBrand.id, approved: false }))).toBe(false);

    expect(ability.can('update', brandSubject({ id: adminBrand.id, approved: false }))).toBe(true);
    expect(ability.can('update', brandSubject({ id: memberBrand.id, approved: false }))).toBe(false);

    expect(ability.can('update', projectSubject({ brandId: memberBrand.id }))).toBe(true);
    expect(ability.can('update', projectSubject({ brandId: strangerBrand.id }))).toBe(false);

    expect(ability.can('create', brandMembershipSubject({ brandId: adminBrand.id }))).toBe(true);
    expect(ability.can('create', brandMembershipSubject({ brandId: memberBrand.id }))).toBe(false);
  });

  it('stamps created_at and updated_at on rows it inserts', async () => {
    const [brand] = await db.insert(brands).values({ name: 'Stamped', slug: 'stamped' }).returning();
    expect(brand.createdAt).toBeInstanceOf(Date);
    expect(brand.updatedAt).toBeInstanceOf(Date);
  });
});
