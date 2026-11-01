import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { ProjectHeadersData } from '../../projectData';
import { findLicense, type License } from '../../licenses';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { brands, projectFiles, projectLinks, projectPromotions, projects, projectsTags, tags } from '../db/schema';
import { failure, type ActionResult } from './actionResult.server';
import {
  brandSubject,
  projectFileSubject,
  projectSubject,
  requireAbility,
  type AppAbility,
} from './authorization.server';
import { loadProjectHeaders } from './projectHeaders.server';
import { bucketName, fileStorage, keyFromFilepath, type FileStorage } from './storage.server';

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

/** A project's id from the last part of its URL, which has a readable suffix after the id, as in `112-1-900-psy-chic` */
export function projectIdFromParam(projectId: string): number {
  const id = Number(/^\d+/.exec(projectId)?.[0]);
  if (!Number.isInteger(id)) {
    notFound();
  }
  return id;
}

export type ProjectFileData = {
  id: number;
  url: string;
  filename: string;
  filesize: number;
  filetype: string | null;
  position: number | null;
};

export type ProjectLinkData = {
  id: number;
  url: string;
  title: string;
  icon: string | null;
  position: number;
};

export type ProjectPageData = {
  project: ProjectHeadersData & {
    description: string | null;
    license: License | null;
    projectFiles: ProjectFileData[];
    projectLinks: ProjectLinkData[];
    currentUserCanEdit: boolean;
    currentUserCanDelete: boolean;
    currentUserCanUploadFiles: boolean;
    currentUserCanDeleteFiles: boolean;
  };
};

/**
 * A project with everything its page shows, for someone allowed to see it (anyone else gets a 404, the same as for a project
 * that doesn't exist). Pass `{ editing: true }` for the pages that edit it, which need permission to.
 */
export async function findProjectPage(
  db: ReadDb,
  ability: AppAbility,
  projectIdParam: string,
  { editing = false }: { editing?: boolean } = {},
): Promise<ProjectPageData> {
  const id = projectIdFromParam(projectIdParam);

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      brand: true,
      projectFiles: { orderBy: sql`position nulls last, id` },
      projectLinks: { orderBy: [asc(projectLinks.position), asc(projectLinks.id)] },
    },
  });
  if (!project?.brand) {
    notFound();
  }
  const subject = projectSubject(project);
  if (!ability.can('read', subject)) {
    notFound();
  }
  if (editing) {
    requireAbility(ability, 'update', subject);
  }

  const [headers] = await loadProjectHeaders(db, [id]);
  const fileSubject = projectFileSubject({ project });

  return {
    project: {
      ...headers,
      description: project.description,
      license: findLicense(project.license),
      projectFiles: project.projectFiles.map((file) => ({
        id: file.id,
        url: file.url,
        filename: file.filename,
        filesize: file.filesize,
        filetype: file.filetype,
        position: file.position,
      })),
      projectLinks: project.projectLinks.map((link) => ({
        id: link.id,
        url: link.url,
        title: link.title,
        icon: link.icon,
        position: link.position,
      })),
      currentUserCanEdit: ability.can('update', subject),
      currentUserCanDelete: ability.can('delete', subject),
      currentUserCanUploadFiles: ability.can('create', fileSubject),
      currentUserCanDeleteFiles: ability.can('delete', fileSubject),
    },
  };
}

/** The brand a new project would belong to, for the new project form, for someone allowed to add projects to it */
export async function findBrandForNewProject(
  db: ReadDb,
  ability: AppAbility,
  brandSlug: string,
): Promise<{ brand: { id: number; name: string; slug: string } }> {
  const brand = await db.query.brands.findFirst({ where: eq(brands.slug, brandSlug) });
  if (!brand || !ability.can('read', brandSubject(brand))) {
    notFound();
  }
  requireAbility(ability, 'create', projectSubject({ brandId: brand.id, brand }));

  return { brand: { id: brand.id, name: brand.name, slug: brand.slug } };
}

// ---- creating, changing and deleting ----

/** Text that's only whitespace is no text at all */
const optionalText = z
  .string()
  .nullish()
  .transform((text) => (text === undefined ? undefined : text?.trim() ? text : null));

const optionalInt = z.number().int().nullish();

const projectAttributes = z.object({
  title: optionalText,
  authors: optionalText,
  description: optionalText,
  licenseId: z.string().nullish(),
  publicationYear: optionalInt,
  minPlayers: optionalInt,
  maxPlayers: optionalInt,
  minFacilitators: optionalInt,
  maxFacilitators: optionalInt,
  lengthQuantity: optionalInt,
  lengthUnits: optionalText,
  tagNames: z.array(z.string()).optional(),
});

type ProjectAttributes = z.infer<typeof projectAttributes>;

/** Checks what was submitted, returning the project's columns to write (only those that were given) and the tag names */
function parseProjectAttributes(input: unknown) {
  const parsed = projectAttributes.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }
  const { licenseId, tagNames, ...columns }: ProjectAttributes = parsed.data;
  if (licenseId && !findLicense(licenseId)) {
    return { errors: ['License is not included in the list'] };
  }

  const values = {
    ...columns,
    ...(licenseId !== undefined ? { license: licenseId || null } : {}),
  };
  // (a column that wasn't submitted at all is left as it is, which `undefined` means to Drizzle; null means to clear it)
  return { values, tagNames };
}

/**
 * Makes the project's tags exactly `names`: tags it has that aren't listed are taken off it, and listed names it doesn't have
 * are added, creating a tag if there's none of that name yet. Names are compared ignoring case, and blank ones are ignored.
 */
async function assignTags(tx: DbOrTx, projectId: number, names: string[]) {
  const wanted = new Map<string, string>();
  for (const name of names.map((n) => n.trim()).filter(Boolean)) {
    if (!wanted.has(name.toLowerCase())) {
      wanted.set(name.toLowerCase(), name);
    }
  }

  const current = await tx
    .select({ id: tags.id, name: tags.name })
    .from(projectsTags)
    .innerJoin(tags, eq(tags.id, projectsTags.tagId))
    .where(eq(projectsTags.projectId, projectId));
  const currentNames = new Set(current.map((tag) => tag.name.toLowerCase()));

  const removedIds = current.filter((tag) => !wanted.has(tag.name.toLowerCase())).map((tag) => tag.id);
  if (removedIds.length > 0) {
    await tx
      .delete(projectsTags)
      .where(and(eq(projectsTags.projectId, projectId), inArray(projectsTags.tagId, removedIds)));
  }

  for (const [lowerName, name] of wanted) {
    if (currentNames.has(lowerName)) {
      continue;
    }
    const existing = await tx.query.tags.findFirst({ where: eq(tags.name, name) });
    const tagId = existing?.id ?? (await tx.insert(tags).values({ name }).returning({ id: tags.id }))[0].id;
    await tx.insert(projectsTags).values({ projectId, tagId });
  }
}

export type ProjectSaved = { project: { id: number; title: string | null; brand: { slug: string } } };

/** Adds a project to a brand, for someone allowed to */
export async function createProject(
  ability: AppAbility,
  brandId: unknown,
  input: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<ProjectSaved>> {
  if (typeof brandId !== 'number' || !Number.isInteger(brandId)) {
    notFound();
  }
  const brand = await db.query.brands.findFirst({ where: eq(brands.id, brandId) });
  if (!brand) {
    notFound();
  }
  requireAbility(ability, 'create', projectSubject({ brandId, brand }));

  const { values, tagNames, errors } = parseProjectAttributes(input);
  if (!values) {
    return failure(...errors);
  }

  return db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({ ...values, brandId })
      .returning({ id: projects.id, title: projects.title });
    await assignTags(tx, project.id, tagNames ?? []);
    return { ok: true as const, project: { ...project, brand: { slug: brand.slug } } };
  });
}

/** Changes a project's properties (and, if tag names are given, its tags) */
export async function updateProject(
  ability: AppAbility,
  id: unknown,
  input: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<ProjectSaved>> {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    notFound();
  }
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { brand: true } });
  if (!project?.brand) {
    notFound();
  }
  requireAbility(ability, 'update', projectSubject(project));

  const { values, tagNames, errors } = parseProjectAttributes(input);
  if (!values) {
    return failure(...errors);
  }

  return db.transaction(async (tx) => {
    // Rails' rule: a project can't have downloadable files without a license to say who may have them
    if (values.license === null && (await tx.$count(projectFiles, eq(projectFiles.projectId, id))) > 0) {
      return failure('License is required because this project has downloadable files');
    }

    const [updated] = await tx
      .update(projects)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning({ id: projects.id, title: projects.title });
    if (tagNames) {
      await assignTags(tx, id, tagNames);
    }
    return { ok: true as const, project: { ...updated, brand: { slug: project.brand!.slug } } };
  });
}

/** Deletes a project with its files (including from storage), links and tags */
export async function deleteProject(
  ability: AppAbility,
  id: unknown,
  { db = realDb, storage = fileStorage }: { db?: DbOrTx; storage?: Pick<FileStorage, 'deleteFile'> } = {},
): Promise<void> {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    notFound();
  }
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { brand: true, projectFiles: true },
  });
  if (!project?.brand) {
    notFound();
  }
  requireAbility(ability, 'delete', projectSubject(project));

  await db.transaction(async (tx) => {
    await tx.delete(projectsTags).where(eq(projectsTags.projectId, id));
    await tx.delete(projectPromotions).where(eq(projectPromotions.projectId, id));
    await tx.delete(projectFiles).where(eq(projectFiles.projectId, id));
    await tx.delete(projectLinks).where(eq(projectLinks.projectId, id));
    await tx.delete(projects).where(eq(projects.id, id));
  });

  // The files are gone from the database; take them out of storage too, and if that fails for one, say so but go on
  for (const file of project.projectFiles) {
    try {
      await storage.deleteFile(keyFromFilepath(file.filepath, bucketName()));
    } catch (error) {
      console.error(`Could not delete ${file.filepath} from storage`, error);
    }
  }
}
