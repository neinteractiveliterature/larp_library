import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '~/server/db';
import { brandMemberships, brands } from '~/server/db/schema';

/** A brand's approval controls whether anyone but its members can see it or its projects. */
export const brandIsApproved = eq(brands.approved, true);

type Viewer = { id: number; admin: boolean | null } | null;

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
    return brandIsApproved;
  }
  return sql`(brands.approved or brands.id in (select brand_memberships.brand_id from brand_memberships where brand_memberships.user_id = ${viewer.id}))`;
}

// Written out with table names rather than interpolating the columns, because Drizzle leaves a column unqualified in a query
// with only one table, which would make the brand's id here read as the project's own.
const projectCountOf = sql<number>`(select count(*)::int from projects where projects.brand_id = brands.id)`;

/** A page of the brands this viewer can see, those with the most projects first, each with the start of its description */
export async function listVisibleBrands(
  db: ReadDb,
  viewer: Viewer,
  { offset, limit, excerptLength }: { offset: number; limit: number; excerptLength: number },
) {
  return db
    .select({
      id: brands.id,
      name: brands.name,
      slug: brands.slug,
      description: sql<string | null>`left(${brands.description}, ${excerptLength})`,
      projectCount: projectCountOf,
    })
    .from(brands)
    .where(visibleBrandsCondition(viewer))
    .orderBy(desc(projectCountOf), asc(brands.name))
    .limit(limit)
    .offset(offset);
}

export async function countVisibleBrands(db: ReadDb, viewer: Viewer) {
  return db.$count(brands, visibleBrandsCondition(viewer));
}

/** The brands waiting for approval, alphabetically, with who created each */
export async function listUnapprovedBrands(db: ReadDb) {
  return db.query.brands.findMany({
    where: eq(brands.approved, false),
    with: { creator: true },
    orderBy: sql`upper(${brands.name})`,
  });
}

export async function findBrandById(db: ReadDb, id: number) {
  return db.query.brands.findFirst({ where: eq(brands.id, id) });
}

export async function findBrandByIdWithCreator(db: ReadDb, id: number) {
  return db.query.brands.findFirst({ where: eq(brands.id, id), with: { creator: true } });
}

export async function findBrandBySlug(db: ReadDb, slug: string) {
  return db.query.brands.findFirst({ where: eq(brands.slug, slug) });
}

export async function insertBrand(
  db: DbOrTx,
  values: { name: string; slug: string; description: string | null; creatorId: number },
) {
  const [created] = await db
    .insert(brands)
    .values({ ...values, approved: false })
    .returning({ id: brands.id, name: brands.name, slug: brands.slug });
  return created;
}

export async function updateBrand(db: DbOrTx, id: number, values: { name: string; description: string | null }) {
  await db.update(brands).set(values).where(eq(brands.id, id));
}

/** Approves a brand. Returns whether this call was the one that did (false if it already was approved). */
export async function approveBrandById(db: DbOrTx, id: number): Promise<boolean> {
  const approved = await db
    .update(brands)
    .set({ approved: true })
    .where(and(eq(brands.id, id), eq(brands.approved, false)))
    .returning({ id: brands.id });
  return approved.length > 0;
}

/** The brands a user belongs to, alphabetically */
export async function listBrandsOfUser(db: ReadDb, userId: number) {
  return db
    .select({ id: brands.id, name: brands.name, slug: brands.slug })
    .from(brands)
    .innerJoin(brandMemberships, eq(brandMemberships.brandId, brands.id))
    .where(eq(brandMemberships.userId, userId))
    .orderBy(sql`upper(${brands.name})`);
}
