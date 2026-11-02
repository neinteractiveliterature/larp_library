import { and, asc, desc, eq, exists, gte, inArray, lte, sql, type SQL } from 'drizzle-orm';
import type { ProjectSearchParams } from '~/ProjectSearch/projectSearchParams';
import type { DbOrTx, ReadDb } from '~/server/db';
import { brands, projectLinks, projects, projectsTags, tags } from '~/server/db/schema';
import { brandIsApproved } from '~/server/repositories/brands.server';

/** How much of a description the cards show (and so how much of it is worth sending) */
export const DESCRIPTION_EXCERPT_LENGTH = 500;

export async function findProjectById(db: ReadDb, id: number) {
  return db.query.projects.findFirst({ where: eq(projects.id, id) });
}

export async function findProjectWithBrand(db: ReadDb, id: number) {
  return db.query.projects.findFirst({ where: eq(projects.id, id), with: { brand: true } });
}

/** A project with its brand and files (for deleting it, which has to delete the files too) */
export async function findProjectWithBrandAndFiles(db: ReadDb, id: number) {
  return db.query.projects.findFirst({ where: eq(projects.id, id), with: { brand: true, projectFiles: true } });
}

/** A project with its brand, and its files and links in the order they're shown */
export async function findProjectWithDetails(db: ReadDb, id: number) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      brand: true,
      projectFiles: { orderBy: sql`position nulls last, id` },
      projectLinks: { orderBy: [asc(projectLinks.position), asc(projectLinks.id)] },
    },
  });
}

/** The given projects with their brands and tags (and the tags' categories), in no particular order; ids that don't exist are missing */
export async function findProjectsWithTags(db: ReadDb, ids: number[]) {
  return db.query.projects.findMany({
    where: inArray(projects.id, ids),
    with: { brand: true, projectsTags: { with: { tag: { with: { tagCategory: true } } } } },
  });
}

/** The start of each given project's description (no more than `length` characters) */
export async function listDescriptionExcerpts(db: ReadDb, ids: number[], length: number) {
  return db
    .select({ id: projects.id, excerpt: sql<string | null>`left(${projects.description}, ${length})` })
    .from(projects)
    .where(inArray(projects.id, ids));
}

export async function insertProject(db: DbOrTx, values: typeof projects.$inferInsert) {
  const [project] = await db.insert(projects).values(values).returning({ id: projects.id, title: projects.title });
  return project;
}

export async function updateProject(db: DbOrTx, id: number, values: Partial<typeof projects.$inferInsert>) {
  const [project] = await db
    .update(projects)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning({ id: projects.id, title: projects.title });
  return project;
}

export async function deleteProject(db: DbOrTx, id: number) {
  await db.delete(projects).where(eq(projects.id, id));
}

/** The ids of a page of a brand's projects, alphabetically by title (ignoring a leading "the" or "a") */
export async function listProjectIdsOfBrand(
  db: ReadDb,
  brandId: number,
  { offset, limit }: { offset: number; limit: number },
) {
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.brandId, brandId))
    .orderBy(asc(projects.titleForOrdering), asc(projects.id))
    .limit(limit)
    .offset(offset);
  return rows.map((row) => row.id);
}

export async function countProjectsOfBrand(db: ReadDb, brandId: number) {
  return db.$count(projects, eq(projects.brandId, brandId));
}

/**
 * A tsquery for the given words, matching the Rails app's pg_search `tsearch` (any one word matching is enough, with the
 * English dictionary, ignoring accents). Each word becomes a quoted lexeme, after removing the characters that would be
 * syntax in a tsquery. Null if there are no words.
 */
function tsquery(words: string): SQL | null {
  const terms = words.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return null;
  }
  return sql.join(
    terms.map(
      (term) =>
        sql`to_tsquery('english', ''' ' || regexp_replace(unaccent(${term}::text), '[''?\\:]', '', 'g') || ' ''')`,
    ),
    sql` || `,
  );
}

// Rails concatenated these three bare, which made a project with no description or no authors (their vectors are NULL) never
// match a search; coalescing means it can still match on the other fields.
const allVectors = sql`(coalesce(${projects.titleVector}, '') || coalesce(${projects.descriptionVector}, '') || coalesce(${projects.authorsVector}, ''))`;

/**
 * The ids of a page of the projects anyone can see (those of approved brands) that match the search, and how many match in all.
 * Results are ordered by how well they match whatever text was searched for, then alphabetically by title (ignoring a leading
 * "the" or "a").
 */
export async function searchProjectIds(
  db: ReadDb,
  params: ProjectSearchParams,
  { offset, limit }: { offset: number; limit: number },
) {
  const queryStringQuery = params.queryString ? tsquery(params.queryString) : null;
  const titleQuery = params.title ? tsquery(params.title) : null;
  const authorsQuery = params.authors ? tsquery(params.authors) : null;

  const conditions = [
    brandIsApproved,
    params.tag
      ? exists(
          db
            .select({ one: sql`1` })
            .from(projectsTags)
            .innerJoin(tags, eq(tags.id, projectsTags.tagId))
            .where(and(eq(projectsTags.projectId, projects.id), eq(tags.name, params.tag))),
        )
      : undefined,
    queryStringQuery ? sql`${allVectors} @@ (${queryStringQuery})` : undefined,
    titleQuery ? sql`${projects.titleVector} @@ (${titleQuery})` : undefined,
    authorsQuery ? sql`${projects.authorsVector} @@ (${authorsQuery})` : undefined,
    params.playerCountUpperBound != null ? gte(projects.maxPlayers, params.playerCountUpperBound) : undefined,
    params.playerCountLowerBound != null ? lte(projects.minPlayers, params.playerCountLowerBound) : undefined,
    params.facilitatorCountUpperBound != null
      ? gte(projects.maxFacilitators, params.facilitatorCountUpperBound)
      : undefined,
    params.facilitatorCountLowerBound != null
      ? lte(projects.minFacilitators, params.facilitatorCountLowerBound)
      : undefined,
  ];
  const where = and(...conditions);

  const ranks = [
    queryStringQuery ? sql`ts_rank(${allVectors}, ${queryStringQuery}, 0)` : undefined,
    titleQuery ? sql`ts_rank(${projects.titleVector}, ${titleQuery}, 0)` : undefined,
    authorsQuery ? sql`ts_rank(${projects.authorsVector}, ${authorsQuery}, 0)` : undefined,
  ].flatMap((rank) => (rank ? [desc(rank)] : []));

  const [pageRows, totalCount] = await Promise.all([
    db
      .select({ id: projects.id })
      .from(projects)
      .innerJoin(brands, eq(brands.id, projects.brandId))
      .where(where)
      .orderBy(...ranks, asc(projects.titleForOrdering), asc(projects.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .innerJoin(brands, eq(brands.id, projects.brandId))
      .where(where)
      .then(([row]) => row.count),
  ]);

  return { ids: pageRows.map((row) => row.id), totalCount };
}
