import { readDbContext } from '~/server/lib/dbContext';
import { autocompleteTags } from '~/server/lib/tags.server';
import type { Route } from './+types/TagAutocompleteRoute';

// No page, just the JSON the tag pickers ask for as the user types
export async function loader({ context, request }: Route.LoaderArgs) {
  const queryString = new URL(request.url).searchParams.get('q') ?? '';
  return Response.json(await autocompleteTags(context.get(readDbContext), queryString));
}
