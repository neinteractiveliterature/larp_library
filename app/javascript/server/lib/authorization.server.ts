import {
  AbilityBuilder,
  createMongoAbility,
  subject as tagSubject,
  type ForcedSubject,
  type MongoAbility,
} from '@casl/ability';
import { eq } from 'drizzle-orm';
import { db, type DbOrTx } from '../db';
import { brandMemberships } from '../db/schema';
import type { AuthUser } from './authContext';

// A port of the Rails app's CanCan Ability. The rules are the same; what changed is how conditions see the world.
// CanCan's conditions walked ActiveRecord associations (brand: { brand_memberships: { user: { id: } } }), whereas CASL
// matches conditions against plain objects. So the user's brand memberships are loaded once, when the ability is built,
// and conditions compare a record's brandId against those ids. Anything else a rule needs from a record's relations (a
// project's brand's approval status, a file's project's brandId) is flattened onto the subject by the mapper functions
// below, which turn the rows Drizzle returns into subjects.

type Action = 'manage' | 'read' | 'create' | 'update' | 'delete' | 'approve';

type SubjectShapes = {
  Project: { brandId: number | null; brandApproved: boolean };
  ProjectFile: { projectBrandId: number | null };
  ProjectLink: { projectBrandId: number | null };
  Brand: { id: number; approved: boolean };
  BrandMembership: { brandId: number | null; invitationToken: string | null };
  User: { id: number };
  // Only ever checked as a kind (can the user create a promotion at all), never against a particular record
  ProjectPromotion: Record<string, never>;
  Tag: Record<string, never>;
  TagCategory: Record<string, never>;
};

type SubjectName = keyof SubjectShapes;
type TaggedSubject = { [Name in SubjectName]: SubjectShapes[Name] & ForcedSubject<Name> }[SubjectName];

export type AppAbility = MongoAbility<[Action, SubjectName | TaggedSubject | 'all']>;

// Check a record with, for example, `ability.can('update', projectSubject(project))`, where `project` was loaded with
// its brand (`with: { brand: true }`). Kinds that are only ever checked as a whole (creating a Brand, a Tag...) can be
// passed by name: `ability.can('create', 'Brand')`.

export function projectSubject(project: { brandId: number | null; brand?: { approved: boolean } | null }) {
  return tagSubject('Project', { brandId: project.brandId, brandApproved: project.brand?.approved === true });
}

export function projectFileSubject(file: { project?: { brandId: number | null } | null }) {
  return tagSubject('ProjectFile', { projectBrandId: file.project?.brandId ?? null });
}

export function projectLinkSubject(link: { project?: { brandId: number | null } | null }) {
  return tagSubject('ProjectLink', { projectBrandId: link.project?.brandId ?? null });
}

export function brandSubject(brand: { id: number; approved: boolean }) {
  return tagSubject('Brand', { id: brand.id, approved: brand.approved });
}

export function brandMembershipSubject(membership: { brandId: number | null; invitationToken?: string | null }) {
  return tagSubject('BrandMembership', {
    brandId: membership.brandId,
    invitationToken: membership.invitationToken ?? null,
  });
}

export function userSubject(user: { id: number }) {
  return tagSubject('User', { id: user.id });
}

export type BrandAccess = { brandId: number; admin: boolean };

export type AbilityOptions = {
  /** The brands the user belongs to, and whether they administer each. Not needed for admins or signed-out visitors. */
  memberships?: BrandAccess[];
  /**
   * The invitation token the visitor presented, if any. Whoever holds it may read that one pending invitation, signed in
   * or not, so they can look at it before accepting.
   */
  invitationToken?: string | null;
};

export function buildAbility(user: Pick<AuthUser, 'id' | 'admin'> | null, options: AbilityOptions = {}): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('read', 'Project', { brandApproved: true });
  can('read', 'Brand', { approved: true });

  if (options.invitationToken) {
    can('read', 'BrandMembership', { invitationToken: options.invitationToken });
  }

  if (user?.admin) {
    can('manage', 'all');
  } else if (user) {
    const memberships = options.memberships ?? [];
    const brandIds = memberships.map((membership) => membership.brandId);
    const adminBrandIds = memberships.filter((membership) => membership.admin).map((membership) => membership.brandId);

    can('read', 'User', { id: user.id });

    can('manage', 'Project', { brandId: { $in: brandIds } });
    can('manage', 'ProjectFile', { projectBrandId: { $in: brandIds } });
    can('manage', 'ProjectLink', { projectBrandId: { $in: brandIds } });

    can('read', 'Brand', { id: { $in: brandIds } });
    can('create', 'Brand');
    can(['update', 'delete'], 'Brand', { id: { $in: adminBrandIds } });

    can('read', 'BrandMembership', { brandId: { $in: brandIds } });
    can('manage', 'BrandMembership', { brandId: { $in: adminBrandIds } });
  }

  return build();
}

/** Loads what the ability depends on for this user and builds it. */
export async function loadAbility(
  user: Pick<AuthUser, 'id' | 'admin'> | null,
  options: Pick<AbilityOptions, 'invitationToken'> = {},
  dbOrTx: DbOrTx = db,
): Promise<AppAbility> {
  // Admins can do everything already, so there's no need to find their memberships.
  if (!user || user.admin) return buildAbility(user, options);

  const rows = await dbOrTx
    .select({ brandId: brandMemberships.brandId, admin: brandMemberships.admin })
    .from(brandMemberships)
    .where(eq(brandMemberships.userId, user.id));

  const memberships = rows.flatMap((row) =>
    // An unaccepted invitation has no user yet, and a membership with no brand is meaningless; neither grants anything.
    row.brandId == null ? [] : [{ brandId: row.brandId, admin: row.admin === true }],
  );
  return buildAbility(user, { ...options, memberships });
}
