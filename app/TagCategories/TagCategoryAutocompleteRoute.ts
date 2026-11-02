import { readDbContext } from '~/server/lib/dbContext';
import { autocompleteTagCategories } from '~/server/lib/tagCategories.server';
import type { Route } from './+types/TagCategoryAutocompleteRoute';

// No page, just the JSON the tag category picker asks for as the user types
export async function loader({ context, request }: Route.LoaderArgs) {
  const queryString = new URL(request.url).searchParams.get('q') ?? '';
  return Response.json(await autocompleteTagCategories(context.get(readDbContext), queryString));
}
