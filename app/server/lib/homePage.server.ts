import sortBy from 'lodash/sortBy';
import type { ProjectHeadersData, TagCategoryData, TagData } from '~/projectData';
import type { ReadDb } from '~/server/db';
import { listVisiblePromotedProjectIds } from '~/server/repositories/projectPromotions.server';
import { countVisibleProjectsByTag } from '~/server/repositories/projectsTags.server';
import { listTagsWithCategories } from '~/server/repositories/tags.server';
import { loadProjectHeaders } from '~/server/lib/projectHeaders.server';
import { tagCategoryData } from '~/server/lib/tagDisplay';

export type TagWithProjectCount = TagData & { projectCount: number };

export type TagGroup = {
  /** Null for the tags that don't belong to a category */
  category: TagCategoryData | null;
  tags: TagWithProjectCount[];
};

export type HomePageData = {
  promotedProjects: ProjectHeadersData[];
  tagGroups: TagGroup[];
};

export async function loadHomePage(db: ReadDb): Promise<HomePageData> {
  const [promotedProjects, tagGroups] = await Promise.all([loadPromotedProjects(db), loadTagGroups(db)]);
  return { promotedProjects, tagGroups };
}

async function loadPromotedProjects(db: ReadDb): Promise<ProjectHeadersData[]> {
  return loadProjectHeaders(db, await listVisiblePromotedProjectIds(db));
}

/** The tags, grouped by category (categories alphabetically, then the uncategorized tags), with how many projects use each */
async function loadTagGroups(db: ReadDb): Promise<TagGroup[]> {
  const [tagRows, countRows] = await Promise.all([
    listTagsWithCategories(db),
    // Only projects anyone can see count, since the number links to a search that only shows those
    countVisibleProjectsByTag(db),
  ]);
  const projectCounts = new Map(countRows.map((row) => [row.tagId, row.projectCount]));

  const categorized = new Map<number, TagGroup>();
  const uncategorized: TagWithProjectCount[] = [];

  for (const tag of tagRows) {
    const withCount = (category: TagCategoryData | null): TagWithProjectCount => ({
      id: tag.id,
      name: tag.name,
      tagCategory: category,
      projectCount: projectCounts.get(tag.id) ?? 0,
    });

    if (tag.tagCategory) {
      const category = tagCategoryData(tag.tagCategory);
      const group = categorized.get(category.id) ?? { category, tags: [] };
      group.tags.push(withCount(category));
      categorized.set(category.id, group);
    } else {
      uncategorized.push(withCount(null));
    }
  }

  const groups = sortBy([...categorized.values()], (group) => group.category?.name);
  return uncategorized.length > 0 ? [...groups, { category: null, tags: uncategorized }] : groups;
}
