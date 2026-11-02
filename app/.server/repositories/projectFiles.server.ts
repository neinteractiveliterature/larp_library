import { and, asc, eq, sql } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '~/.server/db';
import { moveItem, withOrderedListLock } from '~/.server/db/orderedList.server';
import { projectFiles } from '~/.server/db/schema';

/** A file with its project, which has its brand */
export async function findProjectFileWithProject(db: ReadDb, id: number) {
  return db.query.projectFiles.findFirst({
    where: eq(projectFiles.id, id),
    with: { project: { with: { brand: true } } },
  });
}

export async function countFilesOfProject(db: ReadDb, projectId: number) {
  return db.$count(projectFiles, eq(projectFiles.projectId, projectId));
}

/** The ids of a project's files in the order they're shown */
async function fileIdsInOrder(tx: DbOrTx, projectId: number): Promise<number[]> {
  const rows = await tx
    .select({ id: projectFiles.id })
    .from(projectFiles)
    .where(eq(projectFiles.projectId, projectId))
    .orderBy(sql`position nulls last`, asc(projectFiles.id));
  return rows.map((row) => row.id);
}

/** Gives the files positions 1, 2, 3... in the order given */
async function numberFiles(tx: DbOrTx, ids: number[]) {
  for (const [index, id] of ids.entries()) {
    await tx
      .update(projectFiles)
      .set({ position: index + 1 })
      .where(and(eq(projectFiles.id, id), sql`position is distinct from ${index + 1}`));
  }
}

/** Adds a file to the end of a project's list of files */
export async function appendProjectFile(
  db: DbOrTx,
  projectId: number,
  values: {
    uploaderId: number;
    url: string;
    filepath: string;
    filename: string;
    filetype: string | null;
    filesize: number;
  },
) {
  return withOrderedListLock(db, `project_files:${projectId}`, async (tx) => {
    const [{ last }] = await tx
      .select({ last: sql<number>`coalesce(max(${projectFiles.position}), 0)` })
      .from(projectFiles)
      .where(eq(projectFiles.projectId, projectId));

    const [projectFile] = await tx
      .insert(projectFiles)
      .values({ ...values, projectId, position: last + 1 })
      .returning({ id: projectFiles.id });
    return projectFile;
  });
}

/** Deletes a file, closing up the gap in the order of the project's others */
export async function removeProjectFile(db: DbOrTx, file: { id: number; projectId: number }) {
  await withOrderedListLock(db, `project_files:${file.projectId}`, async (tx) => {
    await tx.delete(projectFiles).where(eq(projectFiles.id, file.id));
    await numberFiles(tx, await fileIdsInOrder(tx, file.projectId));
  });
}

/** Moves a file to `destinationIndex` (counting from 0) in its project's list of files */
export async function moveProjectFileTo(db: DbOrTx, file: { id: number; projectId: number }, destinationIndex: number) {
  await withOrderedListLock(db, `project_files:${file.projectId}`, async (tx) => {
    const ids = await fileIdsInOrder(tx, file.projectId);
    await numberFiles(tx, moveItem(ids, ids.indexOf(file.id), destinationIndex));
  });
}

export async function deleteFilesOfProject(db: DbOrTx, projectId: number) {
  await db.delete(projectFiles).where(eq(projectFiles.projectId, projectId));
}
