import { eq } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '../db';
import { brands, projectPromotions, projects } from '../db/schema';
import { brandIsApproved } from './brands.server';

/** Every promotion with its project and the project's brand */
export async function listPromotionsWithProjects(db: ReadDb) {
  return db.query.projectPromotions.findMany({ with: { project: { with: { brand: true } } } });
}

/** The ids of the promoted projects that anyone can see (those of approved brands), alphabetically by title */
export async function listVisiblePromotedProjectIds(db: ReadDb): Promise<number[]> {
  const promoted = await db
    .select({ id: projects.id })
    .from(projectPromotions)
    .innerJoin(projects, eq(projects.id, projectPromotions.projectId))
    .innerJoin(brands, eq(brands.id, projects.brandId))
    .where(brandIsApproved)
    .orderBy(projects.title);
  return promoted.map((row) => row.id);
}

export async function insertPromotion(db: DbOrTx, projectId: number) {
  const [promotion] = await db.insert(projectPromotions).values({ projectId }).returning({ id: projectPromotions.id });
  return promotion;
}

/** Returns whether the project was being promoted */
export async function deletePromotionOfProject(db: DbOrTx, projectId: number): Promise<boolean> {
  const deleted = await db
    .delete(projectPromotions)
    .where(eq(projectPromotions.projectId, projectId))
    .returning({ id: projectPromotions.id });
  return deleted.length > 0;
}
