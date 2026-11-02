import type { TagData } from '~/lib/projectData';
import type { ProjectSearchParams } from '~/lib/project-search/projectSearchParams';
import type { ReadDb } from '~/server/db';
import { searchProjectIds } from '~/server/repositories/projects.server';
import { findTagWithCategoryByName } from '~/server/repositories/tags.server';
import { loadProjectCards, type ProjectCardData } from '~/server/lib/projectHeaders.server';
import { tagCategoryData } from '~/server/lib/tagDisplay';

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
 * The projects anyone can see (those of approved brands) that match the search, a page at a time. Results are ordered by how
 * well they match whatever text was searched for, then alphabetically by title (ignoring a leading "the" or "a").
 */
export async function searchProjects(
  db: ReadDb,
  params: ProjectSearchParams,
  { offset = 0 }: { offset?: number } = {},
): Promise<ProjectSearchPage> {
  const { ids, totalCount } = await searchProjectIds(db, params, { offset, limit: PROJECT_SEARCH_PAGE_SIZE });
  const projectCards = await loadProjectCards(db, ids);

  return { projects: projectCards, totalCount, offset };
}

/** The tag with exactly this name, which the search page shows as the active filter; null if there isn't one */
export async function findTagByName(db: ReadDb, name: string | undefined): Promise<TagData | null> {
  if (!name) {
    return null;
  }

  const tag = await findTagWithCategoryByName(db, name);
  return tag
    ? { id: tag.id, name: tag.name, tagCategory: tag.tagCategory ? tagCategoryData(tag.tagCategory) : null }
    : null;
}
