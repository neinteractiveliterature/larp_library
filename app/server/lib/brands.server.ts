import { z } from 'zod';
import { db as realDb, type DbOrTx, type ReadDb } from '~/server/db';
import {
  approveBrandById,
  countVisibleBrands,
  findBrandById,
  findBrandByIdWithCreator,
  findBrandBySlug,
  insertBrand,
  listBrandsOfUser,
  listUnapprovedBrands as selectUnapprovedBrands,
  listVisibleBrands,
  updateBrand as updateBrandRow,
} from '~/server/repositories/brands.server';
import { insertMember, listMembershipsOfBrand } from '~/server/repositories/brandMemberships.server';
import {
  countProjectsOfBrand,
  DESCRIPTION_EXCERPT_LENGTH,
  listProjectIdsOfBrand,
} from '~/server/repositories/projects.server';
import { failure, isUniqueViolation, type ActionResult } from '~/server/lib/actionResult.server';
import type { AuthUser } from '~/server/lib/authContext';
import {
  brandMembershipSubject,
  brandSubject,
  projectSubject,
  requireAbility,
  type AppAbility,
} from '~/server/lib/authorization.server';
import { sendBrandApprovedEmail, sendBrandPendingEmail, type MailTransport } from '~/server/lib/brandMail.server';
import { parameterize } from '~/server/lib/parameterize';
import { loadProjectCards, type ProjectCardData } from '~/server/lib/projectHeaders.server';

export const BRANDS_PAGE_SIZE = 25;
export const BRAND_PROJECTS_PAGE_SIZE = 25;

type Viewer = Pick<AuthUser, 'id' | 'admin'> | null;

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

export type BrandCardData = {
  id: number;
  name: string;
  slug: string;
  /** The start of the description: no more than DESCRIPTION_EXCERPT_LENGTH characters */
  description: string | null;
  projectCount: number;
};

export type BrandListPageData = { brands: BrandCardData[]; totalCount: number; offset: number };

/** The brands this viewer can see, those with the most larps first, a page at a time */
export async function listBrands(db: ReadDb, viewer: Viewer, { offset = 0 }: { offset?: number } = {}) {
  const [rows, totalCount] = await Promise.all([
    listVisibleBrands(db, viewer, { offset, limit: BRANDS_PAGE_SIZE, excerptLength: DESCRIPTION_EXCERPT_LENGTH }),
    countVisibleBrands(db, viewer),
  ]);

  return { brands: rows, totalCount, offset } satisfies BrandListPageData;
}

export type UnapprovedBrandData = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  creator: { name: string; email: string | null } | null;
};

/** The brands waiting for an administrator to approve them, alphabetically */
export async function listUnapprovedBrands(db: ReadDb, ability: AppAbility): Promise<UnapprovedBrandData[]> {
  requireAbility(ability, 'approve', 'Brand');

  const rows = await selectUnapprovedBrands(db);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.createdAt,
    creator: row.creator ? { name: row.creator.name, email: row.creator.email } : null,
  }));
}

export type BrandPageData = {
  brand: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    /** Only a brand's members and site administrators can see an unapproved brand, so only they ever see `false` */
    approved: boolean;
    currentUserCanEdit: boolean;
    currentUserCanCreateProjects: boolean;
  };
  projects: ProjectCardData[];
  totalCount: number;
  offset: number;
};

/**
 * A brand and a page of its projects, for someone allowed to see it. A brand the viewer isn't allowed to see is a 404, the
 * same as one that doesn't exist, so an unapproved brand's existence isn't given away.
 */
export async function findBrandPage(
  db: ReadDb,
  ability: AppAbility,
  slug: string,
  { offset = 0 }: { offset?: number } = {},
): Promise<BrandPageData> {
  const brand = await findBrandBySlug(db, slug);
  if (!brand || !ability.can('read', brandSubject(brand))) {
    notFound();
  }

  const [projectIds, totalCount] = await Promise.all([
    listProjectIdsOfBrand(db, brand.id, { offset, limit: BRAND_PROJECTS_PAGE_SIZE }),
    countProjectsOfBrand(db, brand.id),
  ]);

  return {
    brand: {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      approved: brand.approved,
      currentUserCanEdit: ability.can('update', brandSubject(brand)),
      currentUserCanCreateProjects: ability.can(
        'create',
        projectSubject({ brandId: brand.id, brand: { approved: brand.approved } }),
      ),
    },
    projects: await loadProjectCards(db, projectIds),
    totalCount,
    offset,
  };
}

/** Approves a brand, which makes it and its projects visible to everyone, and lets its creator know */
export async function approveBrand(
  ability: AppAbility,
  brandId: unknown,
  { db = realDb, transport }: { db?: DbOrTx; transport?: MailTransport } = {},
): Promise<void> {
  requireAbility(ability, 'approve', 'Brand');
  if (typeof brandId !== 'number' || !Number.isInteger(brandId)) {
    notFound();
  }

  const brand = await findBrandByIdWithCreator(db, brandId);
  if (!brand) {
    notFound();
  }

  // Only the request that actually makes the change sends the email, so approving twice doesn't tell the creator twice
  if (await approveBrandById(db, brandId)) {
    await sendBrandApprovedEmail(brand, brand.creator, { transport });
  }
}

// ---- creating and editing ----

/** Paths that are pages of their own, so a brand can't have them as its slug */
const RESERVED_SLUGS = ['new', 'unapproved', 'approve'];

const brandAttributes = z.object({
  name: z.string().trim().min(1, "Name can't be blank"),
  description: z
    .string()
    .nullish()
    .transform((description) => description || null),
});

function parseBrandAttributes(input: unknown) {
  const parsed = brandAttributes.safeParse(input);
  return parsed.success ? { attributes: parsed.data } : { errors: parsed.error.issues.map((issue) => issue.message) };
}

/** Rails' messages for the two ways a brand's name can already be spoken for */
function uniquenessFailure(error: unknown) {
  if (isUniqueViolation(error, 'index_brands_on_name')) {
    return failure('Name has already been taken.');
  }
  if (isUniqueViolation(error, 'index_brands_on_slug')) {
    return failure('Slug has already been taken.  Please choose a different name.');
  }
  return null;
}

/**
 * Creates a brand for a signed-in user, who becomes its administrator. The brand waits for a site administrator's approval
 * before anyone else can see it, and the site administrators are emailed to let them know.
 */
export async function createBrand(
  ability: AppAbility,
  user: Pick<AuthUser, 'id' | 'name' | 'email'>,
  input: unknown,
  { db = realDb, transport }: { db?: DbOrTx; transport?: MailTransport } = {},
): Promise<ActionResult<{ brand: { id: number; slug: string } }>> {
  requireAbility(ability, 'create', 'Brand');
  const { attributes, errors } = parseBrandAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  const slug = parameterize(attributes.name);
  if (!slug) {
    return failure('Name must include at least one letter or number');
  }
  if (RESERVED_SLUGS.includes(slug)) {
    return failure('Slug is reserved');
  }

  let brand: { id: number; name: string; slug: string };
  try {
    brand = await db.transaction(async (tx) => {
      const created = await insertBrand(tx, { ...attributes, slug, creatorId: user.id });
      await insertMember(tx, { brandId: created.id, userId: user.id, admin: true });
      return created;
    });
  } catch (error) {
    const failed = uniquenessFailure(error);
    if (failed) {
      return failed;
    }
    throw error;
  }

  await sendBrandPendingEmail(brand, user, { db, transport });
  return { ok: true, brand: { id: brand.id, slug: brand.slug } };
}

/** Changes a brand's name and description. Its slug (and so its URL) stays what it was. */
export async function updateBrand(
  ability: AppAbility,
  id: unknown,
  input: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<{ brand: { id: number; slug: string } }>> {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    notFound();
  }
  const brand = await findBrandById(db, id);
  if (!brand) {
    notFound();
  }
  requireAbility(ability, 'update', brandSubject(brand));

  const { attributes, errors } = parseBrandAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  try {
    await db.transaction((tx) => updateBrandRow(tx, id, attributes));
  } catch (error) {
    const failed = uniquenessFailure(error);
    if (failed) {
      return failed;
    }
    throw error;
  }
  return { ok: true, brand: { id: brand.id, slug: brand.slug } };
}

/** The brands a user belongs to, alphabetically, for reminding them of them when they go to create another */
export async function listUserBrands(
  db: ReadDb,
  userId: number,
): Promise<{ id: number; name: string; slug: string }[]> {
  return listBrandsOfUser(db, userId);
}

export type BrandEditingData = {
  brand: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    approved: boolean;
    currentUserCanManageMemberships: boolean;
  };
  brandMemberships: {
    id: number;
    admin: boolean;
    invitationEmail: string | null;
    user: { id: number; name: string; email: string | null } | null;
  }[];
};

/** A brand with its members and pending invitations, for the people who can edit it (a 404 for those who can't even see it) */
export async function findBrandForEditing(db: ReadDb, ability: AppAbility, slug: string): Promise<BrandEditingData> {
  const brand = await findBrandBySlug(db, slug);
  if (!brand || !ability.can('read', brandSubject(brand))) {
    notFound();
  }
  requireAbility(ability, 'update', brandSubject(brand));

  const memberships = await listMembershipsOfBrand(db, brand.id);

  return {
    brand: {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      approved: brand.approved,
      currentUserCanManageMemberships: ability.can('manage', brandMembershipSubject({ brandId: brand.id })),
    },
    brandMemberships: memberships.map((membership) => ({
      id: membership.id,
      admin: membership.admin === true,
      invitationEmail: membership.invitationEmail,
      user: membership.user
        ? { id: membership.user.id, name: membership.user.name, email: membership.user.email }
        : null,
    })),
  };
}
