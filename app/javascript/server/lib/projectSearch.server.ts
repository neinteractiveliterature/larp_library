import { and, asc, desc, eq, exists, gte, lte, sql, type SQL } from 'drizzle-orm';
import type { TagData } from '../../projectData';
import type { ProjectSearchParams } from '../../ProjectSearch/projectSearchParams';
import type { ReadDb } from '../db';
import { brands, projects, projectsTags, tags } from '../db/schema';
import { brandIsApproved, loadProjectCards, type ProjectCardData } from './projectHeaders.server';
import { tagCategoryData } from './tagDisplay';

export const PROJECT_SEARCH_PAGE_SIZE = 25;

export type ProjectSearchResult = ProjectCardData;

export type ProjectSearchPage = {
  projects: ProjectSearchResult[];
  /** How many projects match in all, across every page */
  totalCount: number;
  /** Where in the full list of results this page starts */
  offset: number;
};

/**
 * Full-text search for the given words, matching the Rails app's pg_search `tsearch` (any one word matching is enough, with
 * the English dictionary, ignoring accents). Each word becomes a quoted lexeme, after removing the characters that would be
 * syntax in a tsquery.
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
 * The projects anyone can see (those of approved brands) that match the search, a page at a time. Results are ordered by how
 * well they match whatever text was searched for, then alphabetically by title (ignoring a leading "the" or "a").
 */
export async function searchProjects(
  db: ReadDb,
  params: ProjectSearchParams,
  { offset = 0 }: { offset?: number } = {},
): Promise<ProjectSearchPage> {
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
      .limit(PROJECT_SEARCH_PAGE_SIZE)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .innerJoin(brands, eq(brands.id, projects.brandId))
      .where(where)
      .then(([row]) => row.count),
  ]);

  const projectCards = await loadProjectCards(
    db,
    pageRows.map((row) => row.id),
  );

  return { projects: projectCards, totalCount, offset };
}

/** The tag with exactly this name, which the search page shows as the active filter; null if there isn't one */
export async function findTagByName(db: ReadDb, name: string | undefined): Promise<TagData | null> {
  if (!name) {
    return null;
  }

  const tag = await db.query.tags.findFirst({ where: eq(tags.name, name), with: { tagCategory: true } });
  return tag
    ? { id: tag.id, name: tag.name, tagCategory: tag.tagCategory ? tagCategoryData(tag.tagCategory) : null }
    : null;
}
