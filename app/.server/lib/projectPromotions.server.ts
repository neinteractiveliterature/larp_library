import { z } from 'zod';
import { db as realDb, type DbOrTx, type ReadDb } from '~/.server/db';
import {
  deletePromotionOfProject,
  insertPromotion,
  listPromotionsWithProjects,
} from '~/.server/repositories/projectPromotions.server';
import { findProjectById } from '~/.server/repositories/projects.server';
import { failure, isUniqueViolation, type ActionResult } from '~/.server/lib/actionResult.server';
import { requireAbility, type AppAbility } from '~/.server/lib/authorization.server';
import { searchProjects } from '~/.server/lib/projectSearch.server';

export type ProjectPromotionData = {
  id: number;
  createdAt: Date;
  project: { id: number; title: string | null; brand: { slug: string } | null };
};

/** Every promoted project (whoever's it is, since this is for the administrators who manage them), alphabetically by title */
export async function listProjectPromotions(db: ReadDb): Promise<ProjectPromotionData[]> {
  const rows = await listPromotionsWithProjects(db);

  return rows
    .map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      project: {
        id: row.project.id,
        title: row.project.title,
        brand: row.project.brand ? { slug: row.project.brand.slug } : null,
      },
    }))
    .sort((a, b) => (a.project.title ?? '').localeCompare(b.project.title ?? ''));
}

/** For the picker on the promotions page: projects anyone can see (promoting one from an unapproved brand makes no sense) */
export async function findProjectsToPromote(
  db: ReadDb,
  ability: AppAbility,
  queryString: string,
): Promise<{ id: number; title: string | null }[]> {
  requireAbility(ability, 'create', 'ProjectPromotion');

  const { projects: found } = await searchProjects(db, { queryString: queryString || undefined });
  return found.map((project) => ({ id: project.id, title: project.title }));
}

const projectId = z.number().int();

export async function promoteProject(
  ability: AppAbility,
  input: unknown,
  dbOrTx: DbOrTx = realDb,
): Promise<ActionResult<{ projectPromotion: { id: number } }>> {
  requireAbility(ability, 'create', 'ProjectPromotion');
  const parsed = projectId.safeParse(input);
  if (!parsed.success) {
    return failure('Project is required');
  }

  try {
    return await dbOrTx.transaction(async (tx) => {
      const project = await findProjectById(tx, parsed.data);
      if (!project) {
        throw new Response(null, { status: 404, statusText: 'Not Found' });
      }

      return { ok: true as const, projectPromotion: await insertPromotion(tx, project.id) };
    });
  } catch (error) {
    if (isUniqueViolation(error, 'index_project_promotions_on_project_id')) {
      return failure('Project is already being promoted.');
    }
    throw error;
  }
}

export async function unpromoteProject(ability: AppAbility, input: unknown, dbOrTx: DbOrTx = realDb): Promise<void> {
  requireAbility(ability, 'delete', 'ProjectPromotion');
  const parsed = projectId.safeParse(input);
  if (!parsed.success) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }

  if (!(await deletePromotionOfProject(dbOrTx, parsed.data))) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
}
