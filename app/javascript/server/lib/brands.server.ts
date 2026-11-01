import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { brands, projects } from '../db/schema';
import type { AuthUser } from './authContext';
import { brandSubject, projectSubject, requireAbility, type AppAbility } from './authorization.server';
import { sendBrandApprovedEmail, type MailTransport } from './brandMail.server';
import { DESCRIPTION_EXCERPT_LENGTH, loadProjectCards, type ProjectCardData } from './projectHeaders.server';

export const BRANDS_PAGE_SIZE = 25;
export const BRAND_PROJECTS_PAGE_SIZE = 25;

type Viewer = Pick<AuthUser, 'id' | 'admin'> | null;

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

/**
 * Which brands this viewer may see: approved ones, plus the ones they belong to, or all of them for a site administrator.
 * This is the SQL form of the ability's rules for reading a Brand (CanCan's `accessible_by`, which CASL has no equivalent
 * of), so the two have to agree; the tests check that they do.
 */
export function visibleBrandsCondition(viewer: Viewer): SQL {
  if (viewer?.admin) {
    return sql`true`;
  }
  if (!viewer) {
    return eq(brands.approved, true);
  }
  return sql`(brands.approved or brands.id in (select brand_memberships.brand_id from brand_memberships where brand_memberships.user_id = ${viewer.id}))`;
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

// Written out with table names rather than interpolating the columns, because Drizzle leaves a column unqualified in a query
// with only one table, which would make the brand's id here read as the project's own.
const projectCountOf = sql<number>`(select count(*)::int from projects where projects.brand_id = brands.id)`;

/** The brands this viewer can see, those with the most larps first, a page at a time */
export async function listBrands(db: ReadDb, viewer: Viewer, { offset = 0 }: { offset?: number } = {}) {
  const visible = visibleBrandsCondition(viewer);

  const [rows, totalCount] = await Promise.all([
    db
      .select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: sql<string | null>`left(${brands.description}, ${DESCRIPTION_EXCERPT_LENGTH})`,
        projectCount: projectCountOf,
      })
      .from(brands)
      .where(visible)
      .orderBy(desc(projectCountOf), asc(brands.name))
      .limit(BRANDS_PAGE_SIZE)
      .offset(offset),
    db.$count(brands, visible),
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

  const rows = await db.query.brands.findMany({
    where: eq(brands.approved, false),
    with: { creator: true },
    orderBy: sql`upper(${brands.name})`,
  });
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
  const brand = await db.query.brands.findFirst({ where: eq(brands.slug, slug) });
  if (!brand || !ability.can('read', brandSubject(brand))) {
    notFound();
  }

  const [projectRows, totalCount] = await Promise.all([
    db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.brandId, brand.id))
      .orderBy(asc(projects.titleForOrdering), asc(projects.id))
      .limit(BRAND_PROJECTS_PAGE_SIZE)
      .offset(offset),
    db.$count(projects, eq(projects.brandId, brand.id)),
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
    projects: await loadProjectCards(
      db,
      projectRows.map((row) => row.id),
    ),
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

  const brand = await db.query.brands.findFirst({ where: eq(brands.id, brandId), with: { creator: true } });
  if (!brand) {
    notFound();
  }

  // Only the request that actually makes the change sends the email, so approving twice doesn't tell the creator twice
  const [approved] = await db
    .update(brands)
    .set({ approved: true })
    .where(and(eq(brands.id, brandId), eq(brands.approved, false)))
    .returning({ id: brands.id });
  if (approved) {
    await sendBrandApprovedEmail(brand, brand.creator, { transport });
  }
}
