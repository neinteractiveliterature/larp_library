import { count, eq, sql } from 'drizzle-orm';
import sortBy from 'lodash/sortBy';
import type { ProjectHeadersData, TagCategoryData, TagData } from '../../projectData';
import type { ReadDb } from '../db';
import { brands, projectPromotions, projects, projectsTags, tags } from '../db/schema';
import { brandIsApproved, loadProjectHeaders } from './projectHeaders.server';
import { tagCategoryData } from './tagDisplay';

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
  const promoted = await db
    .select({ id: projects.id })
    .from(projectPromotions)
    .innerJoin(projects, eq(projects.id, projectPromotions.projectId))
    .innerJoin(brands, eq(brands.id, projects.brandId))
    .where(brandIsApproved)
    .orderBy(projects.title);

  return loadProjectHeaders(
    db,
    promoted.map((row) => row.id),
  );
}

/** The tags, grouped by category (categories alphabetically, then the uncategorized tags), with how many projects use each */
async function loadTagGroups(db: ReadDb): Promise<TagGroup[]> {
  const [tagRows, countRows] = await Promise.all([
    db.query.tags.findMany({ with: { tagCategory: true }, orderBy: sql`upper(${tags.name})` }),
    // Only projects anyone can see count, since the number links to a search that only shows those
    db
      .select({ tagId: projectsTags.tagId, projectCount: count() })
      .from(projectsTags)
      .innerJoin(projects, eq(projects.id, projectsTags.projectId))
      .innerJoin(brands, eq(brands.id, projects.brandId))
      .where(brandIsApproved)
      .groupBy(projectsTags.tagId),
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
