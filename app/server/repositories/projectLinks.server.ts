import { and, asc, eq, sql } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '../db';
import { moveItem, withOrderedListLock } from '../db/orderedList.server';
import { projectLinks } from '../db/schema';

/** A link with its project, which has its brand */
export async function findProjectLinkWithProject(db: ReadDb, id: number) {
  return db.query.projectLinks.findFirst({
    where: eq(projectLinks.id, id),
    with: { project: { with: { brand: true } } },
  });
}

/** The ids of a project's links in the order they're shown */
async function linkIdsInOrder(tx: DbOrTx, projectId: number): Promise<number[]> {
  const rows = await tx
    .select({ id: projectLinks.id })
    .from(projectLinks)
    .where(eq(projectLinks.projectId, projectId))
    .orderBy(asc(projectLinks.position), asc(projectLinks.id));
  return rows.map((row) => row.id);
}

/** Gives the links positions 1, 2, 3... in the order given */
async function numberLinks(tx: DbOrTx, ids: number[]) {
  for (const [index, id] of ids.entries()) {
    await tx
      .update(projectLinks)
      .set({ position: index + 1 })
      .where(and(eq(projectLinks.id, id), sql`position is distinct from ${index + 1}`));
  }
}

/** Adds a link to the end of a project's list of links */
export async function appendProjectLink(
  db: DbOrTx,
  projectId: number,
  values: { title: string; url: string; icon: string | null },
) {
  return withOrderedListLock(db, `project_links:${projectId}`, async (tx) => {
    const [{ last }] = await tx
      .select({ last: sql<number>`coalesce(max(${projectLinks.position}), 0)` })
      .from(projectLinks)
      .where(eq(projectLinks.projectId, projectId));

    const [projectLink] = await tx
      .insert(projectLinks)
      .values({ ...values, projectId, position: last + 1 })
      .returning({ id: projectLinks.id });
    return projectLink;
  });
}

export async function updateProjectLink(
  db: DbOrTx,
  id: number,
  values: { title: string; url: string; icon: string | null },
) {
  await db.update(projectLinks).set(values).where(eq(projectLinks.id, id));
}

/** Deletes a link, closing up the gap in the order of the project's others */
export async function removeProjectLink(db: DbOrTx, link: { id: number; projectId: number }) {
  await withOrderedListLock(db, `project_links:${link.projectId}`, async (tx) => {
    await tx.delete(projectLinks).where(eq(projectLinks.id, link.id));
    await numberLinks(tx, await linkIdsInOrder(tx, link.projectId));
  });
}

/** Moves a link to `destinationIndex` (counting from 0) in its project's list of links */
export async function moveProjectLinkTo(db: DbOrTx, link: { id: number; projectId: number }, destinationIndex: number) {
  await withOrderedListLock(db, `project_links:${link.projectId}`, async (tx) => {
    const ids = await linkIdsInOrder(tx, link.projectId);
    await numberLinks(tx, moveItem(ids, ids.indexOf(link.id), destinationIndex));
  });
}

export async function deleteLinksOfProject(db: DbOrTx, projectId: number) {
  await db.delete(projectLinks).where(eq(projectLinks.projectId, projectId));
}
