import { eq, inArray, sql } from 'drizzle-orm';
import type { ProjectHeadersData } from '../../projectData';
import type { ReadDb } from '../db';
import { brands, projects } from '../db/schema';
import { tagCategoryData } from './tagDisplay';

/** A brand's approval controls whether anyone but its members can see it or its projects. */
export const brandIsApproved = eq(brands.approved, true);

/**
 * The cards' worth of data for the given projects, in the order the ids are given (so a caller can sort in the database and
 * load the details after). Ids that don't exist, or whose project has no brand, are skipped.
 */
export async function loadProjectHeaders(db: ReadDb, projectIds: number[]): Promise<ProjectHeadersData[]> {
  if (projectIds.length === 0) {
    return [];
  }

  const rows = await db.query.projects.findMany({
    where: inArray(projects.id, projectIds),
    with: { brand: true, projectsTags: { with: { tag: { with: { tagCategory: true } } } } },
  });
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  return projectIds.flatMap((id): ProjectHeadersData[] => {
    const row = rowsById.get(id);
    if (!row?.brand) {
      return [];
    }

    return [
      {
        id: row.id,
        title: row.title,
        authors: row.authors,
        minPlayers: row.minPlayers,
        maxPlayers: row.maxPlayers,
        minFacilitators: row.minFacilitators,
        maxFacilitators: row.maxFacilitators,
        publicationYear: row.publicationYear,
        lengthQuantity: row.lengthQuantity,
        lengthUnits: row.lengthUnits,
        brand: { id: row.brand.id, name: row.brand.name, slug: row.brand.slug },
        tags: row.projectsTags.flatMap(({ tag }) =>
          tag
            ? [
                {
                  id: tag.id,
                  name: tag.name,
                  tagCategory: tag.tagCategory ? tagCategoryData(tag.tagCategory) : null,
                },
              ]
            : [],
        ),
      },
    ];
  });
}

/** How much of a description the cards show (and so how much of it is worth sending) */
export const DESCRIPTION_EXCERPT_LENGTH = 500;

export type ProjectCardData = ProjectHeadersData & {
  /** The start of the description: no more than DESCRIPTION_EXCERPT_LENGTH characters */
  description: string | null;
};

/** What the project cards show, for the given projects, in the order the ids are given */
export async function loadProjectCards(db: ReadDb, projectIds: number[]): Promise<ProjectCardData[]> {
  if (projectIds.length === 0) {
    return [];
  }

  const [headers, descriptions] = await Promise.all([
    loadProjectHeaders(db, projectIds),
    db
      .select({
        id: projects.id,
        excerpt: sql<string | null>`left(${projects.description}, ${DESCRIPTION_EXCERPT_LENGTH})`,
      })
      .from(projects)
      .where(inArray(projects.id, projectIds)),
  ]);
  const excerpts = new Map(descriptions.map((row) => [row.id, row.excerpt]));

  return headers.map((header) => ({ ...header, description: excerpts.get(header.id) ?? null }));
}
