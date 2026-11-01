import { eq, inArray } from 'drizzle-orm';
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
