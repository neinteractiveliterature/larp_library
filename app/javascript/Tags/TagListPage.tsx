import type { JSX } from 'react';
import { Link } from 'react-router';
import { pageTitle } from '../pageTitle';
import { readDbContext } from '../server/lib/dbContext';
import { listTags } from '../server/lib/tags.server';
import Tag from './Tag';
import type { Route } from './+types/TagListPage';

export async function loader({ context }: Route.LoaderArgs) {
  return { tags: await listTags(context.get(readDbContext)) };
}

export default function TagListPage({ loaderData: { tags } }: Route.ComponentProps): JSX.Element {
  return (
    <>
      <h1>Tags</h1>

      <Link to="/tags/new" className="btn btn-primary">
        New tag
      </Link>

      <ul className="list-unstyled my-4">
        {tags.map((tag) => (
          <div className="mb-1" key={tag.id}>
            <Tag tag={tag} linkTo={`/tags/${tag.id}/edit`} />
          </div>
        ))}
      </ul>

      <Link to="/tags/new" className="btn btn-primary">
        New tag
      </Link>
    </>
  );
}

export const meta = pageTitle('Tags');
