import type { JSX } from 'react';
import { Link } from 'react-router';
import { pageTitle } from '~/lib/pageTitle';
import { readDbContext } from '~/.server/lib/dbContext';
import { listTagCategories } from '~/.server/lib/tagCategories.server';
import TagCategory from '~/components/tag-categories/TagCategory';
import type { Route } from './+types/TagCategoryListPage';

export async function loader({ context }: Route.LoaderArgs) {
  return { tagCategories: await listTagCategories(context.get(readDbContext)) };
}

export default function TagCategoryListPage({ loaderData: { tagCategories } }: Route.ComponentProps): JSX.Element {
  return (
    <>
      <h1>Tag categories</h1>

      <Link to="/tag_categories/new" className="btn btn-primary">
        New tag category
      </Link>

      <ul className="list-unstyled my-4">
        {tagCategories.map((tagCategory) => (
          <div className="mb-1" key={tagCategory.id}>
            <TagCategory tagCategory={tagCategory} linkTo={`/tag_categories/${tagCategory.id}/edit`} />
          </div>
        ))}
      </ul>

      <Link to="/tag_categories/new" className="btn btn-primary">
        New tag category
      </Link>
    </>
  );
}

export const meta = pageTitle('Tag categories');
