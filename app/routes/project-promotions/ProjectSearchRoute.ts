import { abilityContext } from '~/server/lib/authContext';
import { readDbContext } from '~/server/lib/dbContext';
import { findProjectsToPromote } from '~/server/lib/projectPromotions.server';
import type { Route } from './+types/ProjectSearchRoute';

// No page, just the JSON the project picker on the promotions page asks for as the user types
export async function loader({ context, request }: Route.LoaderArgs) {
  const queryString = new URL(request.url).searchParams.get('q') ?? '';
  const projects = await findProjectsToPromote(context.get(readDbContext), context.get(abilityContext), queryString);
  return Response.json(projects);
}
