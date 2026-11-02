import { z } from 'zod';
import { db as realDb, type DbOrTx } from '../db';
import { findProjectWithBrand } from '../repositories/projects.server';
import {
  appendProjectFile,
  findProjectFileWithProject,
  moveProjectFileTo,
  removeProjectFile,
} from '../repositories/projectFiles.server';
import { failure, isUniqueViolation, type ActionResult } from './actionResult.server';
import type { AuthUser } from './authContext';
import { projectFileSubject, requireAbility, type AppAbility } from './authorization.server';
import {
  bucketName,
  fileStorage,
  keyFromFilepath,
  UPLOAD_KEY_PREFIX,
  type FileStorage,
  type UploadTarget,
} from './storage.server';

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

const NEEDS_LICENSE = 'Attaching files is only allowed for projects that specify a license';

function isId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/** The project, loaded with its brand, or a 404 */
async function loadProject(db: DbOrTx, projectId: unknown) {
  if (!isId(projectId)) {
    notFound();
  }
  const project = await findProjectWithBrand(db, projectId);
  if (!project?.brand) {
    notFound();
  }
  return project;
}

const upload = z.object({
  filename: z.string().trim().min(1, 'Filename is required'),
  filetype: z.string().nullish(),
});

/**
 * Starts adding a file to a project: gives the browser somewhere to send the file's bytes, which it does directly to storage
 * rather than through this server. Nothing is recorded until the upload is reported finished (see `completeFileUpload`).
 */
export async function requestFileUpload(
  ability: AppAbility,
  projectId: unknown,
  input: unknown,
  { db = realDb, storage = fileStorage }: { db?: DbOrTx; storage?: Pick<FileStorage, 'createUploadTarget'> } = {},
): Promise<ActionResult<{ upload: UploadTarget }>> {
  const project = await loadProject(db, projectId);
  requireAbility(ability, 'create', projectFileSubject({ project }));
  if (!project.license) {
    return failure(NEEDS_LICENSE);
  }

  const parsed = upload.safeParse(input);
  if (!parsed.success) {
    return failure(...parsed.error.issues.map((issue) => issue.message));
  }

  const { filename, filetype } = parsed.data;
  return {
    ok: true,
    upload: await storage.createUploadTarget({ filename, contentType: filetype || 'application/octet-stream' }),
  };
}

const finishedUpload = z.object({
  key: z.string().min(1),
  filename: z.string().trim().min(1, 'Filename is required'),
  filetype: z.string().nullish(),
});

/** Is this a key `createUploadTarget` could have made: somewhere in uploads/, and not trying to climb out of it */
function isUploadKey(key: string): boolean {
  return key.startsWith(UPLOAD_KEY_PREFIX) && !key.split('/').some((part) => part === '..' || part === '.');
}

/**
 * Records a file that's been uploaded, once the browser reports it has finished, and adds it to the end of the project's list
 * of files. What's recorded is what's actually in storage: the key must be one of ours, the file must be there, and its size
 * is the one storage reports, not the one the browser claims.
 */
export async function completeFileUpload(
  ability: AppAbility,
  uploadedBy: Pick<AuthUser, 'id'>,
  projectId: unknown,
  input: unknown,
  {
    db = realDb,
    storage = fileStorage,
  }: { db?: DbOrTx; storage?: Pick<FileStorage, 'findFileSize' | 'publicUrl'> } = {},
): Promise<ActionResult<{ projectFile: { id: number } }>> {
  const project = await loadProject(db, projectId);
  requireAbility(ability, 'create', projectFileSubject({ project }));
  if (!project.license) {
    return failure(NEEDS_LICENSE);
  }

  const parsed = finishedUpload.safeParse(input);
  if (!parsed.success) {
    return failure(...parsed.error.issues.map((issue) => issue.message));
  }
  const { key, filename, filetype } = parsed.data;
  if (!isUploadKey(key)) {
    return failure('That upload is not valid');
  }
  const filesize = await storage.findFileSize(key);
  if (filesize === null) {
    return failure('The uploaded file could not be found');
  }

  try {
    const projectFile = await appendProjectFile(db, project.id, {
      uploaderId: uploadedBy.id,
      url: storage.publicUrl(key),
      filepath: key,
      filename,
      filetype: filetype || null,
      filesize,
    });
    return { ok: true, projectFile };
  } catch (error) {
    if (isUniqueViolation(error, 'index_project_files_on_filepath')) {
      return failure('That file has already been added');
    }
    throw error;
  }
}

async function loadFile(db: DbOrTx, fileId: unknown) {
  if (!isId(fileId)) {
    notFound();
  }
  const file = await findProjectFileWithProject(db, fileId);
  if (!file?.project) {
    notFound();
  }
  return { file, project: file.project };
}

/** Deletes a file from the project and from storage, closing up the gap in the order of the others */
export async function deleteProjectFile(
  ability: AppAbility,
  fileId: unknown,
  { db = realDb, storage = fileStorage }: { db?: DbOrTx; storage?: Pick<FileStorage, 'deleteFile'> } = {},
): Promise<void> {
  const { file, project } = await loadFile(db, fileId);
  requireAbility(ability, 'delete', projectFileSubject({ project }));

  await removeProjectFile(db, { id: file.id, projectId: project.id });

  // It's gone from the database; take it out of storage too, and if that fails say so but don't undo the deletion
  try {
    await storage.deleteFile(keyFromFilepath(file.filepath, bucketName()));
  } catch (error) {
    console.error(`Could not delete ${file.filepath} from storage`, error);
  }
}

/** Moves a file to `destinationIndex` (counting from 0) in its project's list of files */
export async function moveProjectFile(
  ability: AppAbility,
  fileId: unknown,
  destinationIndex: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<void> {
  const { file, project } = await loadFile(db, fileId);
  requireAbility(ability, 'update', projectFileSubject({ project }));
  if (!isId(destinationIndex)) {
    notFound();
  }

  await moveProjectFileTo(db, { id: file.id, projectId: project.id }, destinationIndex);
}
