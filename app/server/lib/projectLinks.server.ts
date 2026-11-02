import { z } from 'zod';
import { db as realDb, type DbOrTx } from '../db';
import { findProjectWithBrand } from '../repositories/projects.server';
import {
  appendProjectLink,
  findProjectLinkWithProject,
  moveProjectLinkTo,
  removeProjectLink,
  updateProjectLink as updateProjectLinkRow,
} from '../repositories/projectLinks.server';
import { failure, type ActionResult } from './actionResult.server';
import { projectLinkSubject, requireAbility, type AppAbility } from './authorization.server';

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

function isId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/**
 * The address to link to for what was typed. Addresses without a scheme (`example.com`) are taken to be web addresses, and only
 * web (and mailto) addresses are allowed: a link on a public page must not be able to run script (`javascript:...`).
 */
export function normalizeLinkUrl(typed: string): string | null {
  const trimmed = typed.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? withScheme : null;
  } catch {
    return null;
  }
}

const linkAttributes = z.object({
  title: z.string().trim().min(1, "Title can't be blank"),
  url: z.string().trim().min(1, "Url can't be blank"),
  icon: z
    .string()
    .nullish()
    .transform((icon) => icon?.trim() || null),
});

function parseLinkAttributes(input: unknown) {
  const parsed = linkAttributes.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }
  const url = normalizeLinkUrl(parsed.data.url);
  if (!url) {
    return { errors: ['Url must be a web address (starting with http:// or https://)'] };
  }
  return { attributes: { ...parsed.data, url } };
}

async function loadLink(db: DbOrTx, linkId: unknown) {
  if (!isId(linkId)) {
    notFound();
  }
  const link = await findProjectLinkWithProject(db, linkId);
  if (!link?.project) {
    notFound();
  }
  return { link, project: link.project };
}

/** Adds a link to the end of a project's list of links */
export async function createProjectLink(
  ability: AppAbility,
  projectId: unknown,
  input: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<{ projectLink: { id: number } }>> {
  if (!isId(projectId)) {
    notFound();
  }
  const project = await findProjectWithBrand(db, projectId);
  if (!project?.brand) {
    notFound();
  }
  requireAbility(ability, 'create', projectLinkSubject({ project }));

  const { attributes, errors } = parseLinkAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  return { ok: true, projectLink: await appendProjectLink(db, projectId, attributes) };
}

export async function updateProjectLink(
  ability: AppAbility,
  linkId: unknown,
  input: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<{ projectLink: { id: number } }>> {
  const { link, project } = await loadLink(db, linkId);
  requireAbility(ability, 'update', projectLinkSubject({ project }));

  const { attributes, errors } = parseLinkAttributes(input);
  if (!attributes) {
    return failure(...errors);
  }

  await updateProjectLinkRow(db, link.id, attributes);
  return { ok: true, projectLink: { id: link.id } };
}

/** Deletes a link, closing up the gap in the order of the others */
export async function deleteProjectLink(
  ability: AppAbility,
  linkId: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<void> {
  const { link, project } = await loadLink(db, linkId);
  requireAbility(ability, 'delete', projectLinkSubject({ project }));

  await removeProjectLink(db, link);
}

/** Moves a link to `destinationIndex` (counting from 0) in its project's list of links */
export async function moveProjectLink(
  ability: AppAbility,
  linkId: unknown,
  destinationIndex: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<void> {
  const { link, project } = await loadLink(db, linkId);
  requireAbility(ability, 'update', projectLinkSubject({ project }));
  if (!isId(destinationIndex)) {
    notFound();
  }

  await moveProjectLinkTo(db, link, destinationIndex);
}
