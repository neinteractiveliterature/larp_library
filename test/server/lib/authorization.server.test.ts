// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  brandMembershipSubject,
  brandSubject,
  buildAbility,
  loadAbility,
  projectFileSubject,
  projectLinkSubject,
  projectSubject,
  userSubject,
} from '~/.server/lib/authorization.server';
import type { DbOrTx } from '~/.server/db';

// Brand 1 is approved, brand 2 isn't, and brand 3 is an approved brand nobody in these tests belongs to.
const approvedProject = { brandId: 1, brand: { approved: true } };
const unapprovedProject = { brandId: 2, brand: { approved: false } };
const otherBrandProject = { brandId: 3, brand: { approved: true } };

const nobody = null;
const outsider = { id: 10, admin: false };
const member = { id: 11, admin: false }; // member of brand 1, administrator of brand 2
const memberships = [
  { brandId: 1, admin: false },
  { brandId: 2, admin: true },
];
const siteAdmin = { id: 12, admin: true };

describe('a signed-out visitor', () => {
  const ability = buildAbility(nobody);

  it('can read approved brands and their projects, and nothing unapproved', () => {
    expect(ability.can('read', projectSubject(approvedProject))).toBe(true);
    expect(ability.can('read', projectSubject(unapprovedProject))).toBe(false);
    expect(ability.can('read', brandSubject({ id: 1, approved: true }))).toBe(true);
    expect(ability.can('read', brandSubject({ id: 2, approved: false }))).toBe(false);
  });

  it("can't change anything", () => {
    expect(ability.can('create', 'Brand')).toBe(false);
    expect(ability.can('update', projectSubject(approvedProject))).toBe(false);
    expect(ability.can('read', projectFileSubject({ project: approvedProject }))).toBe(false);
    expect(ability.can('read', 'Tag')).toBe(false);
    expect(ability.can('read', brandMembershipSubject({ brandId: 1, invitationToken: 'abc' }))).toBe(false);
  });
});

describe('a signed-out visitor holding an invitation token', () => {
  const ability = buildAbility(nobody, { invitationToken: 'abc' });

  it('can read only the invitation with that token', () => {
    expect(ability.can('read', brandMembershipSubject({ brandId: 1, invitationToken: 'abc' }))).toBe(true);
    expect(ability.can('read', brandMembershipSubject({ brandId: 1, invitationToken: 'other' }))).toBe(false);
    expect(ability.can('read', brandMembershipSubject({ brandId: 1, invitationToken: null }))).toBe(false);
  });

  it("can't accept or manage it", () => {
    expect(ability.can('update', brandMembershipSubject({ brandId: 1, invitationToken: 'abc' }))).toBe(false);
    expect(ability.can('delete', brandMembershipSubject({ brandId: 1, invitationToken: 'abc' }))).toBe(false);
  });
});

describe('a signed-in user with no brands', () => {
  const ability = buildAbility(outsider);

  it('can create a brand', () => {
    expect(ability.can('create', 'Brand')).toBe(true);
  });

  it('can read themself but not other users', () => {
    expect(ability.can('read', userSubject({ id: 10 }))).toBe(true);
    expect(ability.can('read', userSubject({ id: 11 }))).toBe(false);
  });

  it("can't touch any brand's projects, files or links", () => {
    expect(ability.can('update', projectSubject(approvedProject))).toBe(false);
    expect(ability.can('create', projectSubject(approvedProject))).toBe(false);
    expect(ability.can('create', projectFileSubject({ project: approvedProject }))).toBe(false);
    expect(ability.can('update', projectLinkSubject({ project: approvedProject }))).toBe(false);
  });
});

describe('a brand member (administrator of brand 2, ordinary member of brand 1)', () => {
  const ability = buildAbility(member, { memberships });

  it("can manage their brands' projects, files and links, even when the brand is unapproved", () => {
    for (const project of [approvedProject, unapprovedProject]) {
      expect(ability.can('read', projectSubject(project))).toBe(true);
      expect(ability.can('create', projectSubject(project))).toBe(true);
      expect(ability.can('update', projectSubject(project))).toBe(true);
      expect(ability.can('delete', projectSubject(project))).toBe(true);
      expect(ability.can('create', projectFileSubject({ project }))).toBe(true);
      expect(ability.can('delete', projectFileSubject({ project }))).toBe(true);
      expect(ability.can('update', projectLinkSubject({ project }))).toBe(true);
    }
  });

  it("can't touch the projects of a brand they don't belong to", () => {
    expect(ability.can('update', projectSubject(otherBrandProject))).toBe(false);
    expect(ability.can('create', projectFileSubject({ project: otherBrandProject }))).toBe(false);
    expect(ability.can('delete', projectLinkSubject({ project: otherBrandProject }))).toBe(false);
  });

  it('can read their own brands, including unapproved ones, but not unapproved brands they are not in', () => {
    expect(ability.can('read', brandSubject({ id: 2, approved: false }))).toBe(true);
    expect(ability.can('read', brandSubject({ id: 4, approved: false }))).toBe(false);
  });

  it('can edit and delete only the brands they administer', () => {
    expect(ability.can('update', brandSubject({ id: 2, approved: false }))).toBe(true);
    expect(ability.can('delete', brandSubject({ id: 2, approved: false }))).toBe(true);
    expect(ability.can('update', brandSubject({ id: 1, approved: true }))).toBe(false);
    expect(ability.can('delete', brandSubject({ id: 1, approved: true }))).toBe(false);
  });

  it("can read their brands' memberships, but manage only those of brands they administer", () => {
    expect(ability.can('read', brandMembershipSubject({ brandId: 1 }))).toBe(true);
    expect(ability.can('create', brandMembershipSubject({ brandId: 1 }))).toBe(false);
    expect(ability.can('delete', brandMembershipSubject({ brandId: 1 }))).toBe(false);
    expect(ability.can('create', brandMembershipSubject({ brandId: 2 }))).toBe(true);
    expect(ability.can('delete', brandMembershipSubject({ brandId: 2 }))).toBe(true);
    expect(ability.can('read', brandMembershipSubject({ brandId: 3 }))).toBe(false);
  });

  it("can't do the things only site administrators can", () => {
    expect(ability.can('approve', brandSubject({ id: 2, approved: false }))).toBe(false);
    expect(ability.can('create', 'ProjectPromotion')).toBe(false);
    expect(ability.can('delete', 'ProjectPromotion')).toBe(false);
    for (const action of ['create', 'update', 'delete'] as const) {
      expect(ability.can(action, 'Tag')).toBe(false);
      expect(ability.can(action, 'TagCategory')).toBe(false);
    }
  });
});

describe('a site administrator', () => {
  const ability = buildAbility(siteAdmin);

  it('can do everything, including the admin-only actions', () => {
    expect(ability.can('approve', brandSubject({ id: 2, approved: false }))).toBe(true);
    expect(ability.can('create', 'ProjectPromotion')).toBe(true);
    expect(ability.can('delete', 'ProjectPromotion')).toBe(true);
    expect(ability.can('update', 'Tag')).toBe(true);
    expect(ability.can('update', 'TagCategory')).toBe(true);
    expect(ability.can('update', projectSubject(unapprovedProject))).toBe(true);
    expect(ability.can('delete', brandMembershipSubject({ brandId: 3 }))).toBe(true);
  });
});

describe('loadAbility', () => {
  // Stands in for the one query loadAbility makes: select().from().where() resolving to a user's membership rows
  function fakeDb(rows: { brandId: number | null; admin: boolean | null }[]): DbOrTx {
    const query = { from: () => ({ where: async () => rows }) };
    return { select: () => query } as unknown as DbOrTx;
  }

  it("builds the ability from the user's memberships", async () => {
    const ability = await loadAbility(
      member,
      {},
      fakeDb([
        { brandId: 1, admin: false },
        { brandId: 2, admin: true },
        { brandId: null, admin: true },
      ]),
    );
    expect(ability.can('update', projectSubject(unapprovedProject))).toBe(true);
    expect(ability.can('update', brandSubject({ id: 2, approved: false }))).toBe(true);
    expect(ability.can('update', brandSubject({ id: 1, approved: true }))).toBe(false);
  });

  it('treats a membership whose admin flag was never set as an ordinary membership', async () => {
    const ability = await loadAbility(member, {}, fakeDb([{ brandId: 1, admin: null }]));
    expect(ability.can('update', projectSubject(approvedProject))).toBe(true);
    expect(ability.can('update', brandSubject({ id: 1, approved: true }))).toBe(false);
  });

  it("doesn't query for signed-out visitors or administrators", async () => {
    const throwingDb = {
      select: () => {
        throw new Error('should not query');
      },
    } as unknown as DbOrTx;
    expect((await loadAbility(nobody, {}, throwingDb)).can('create', 'Brand')).toBe(false);
    expect((await loadAbility(siteAdmin, {}, throwingDb)).can('approve', 'Brand')).toBe(true);
  });

  it('passes the invitation token through', async () => {
    const ability = await loadAbility(nobody, { invitationToken: 'abc' });
    expect(ability.can('read', brandMembershipSubject({ brandId: 1, invitationToken: 'abc' }))).toBe(true);
  });
});
