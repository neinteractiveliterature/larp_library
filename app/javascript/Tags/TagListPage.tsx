import type { JSX } from 'react';
import { Link } from 'react-router';
import { appContext } from '../appContext';
import { Waypoint } from '../Waypoint';
import { TagListPageQueryDocument, useTagListPageQuery } from './queries.generated';
import Tag from './Tag';
import { pageTitle } from '../pageTitle';
import type { Route } from './+types/TagListPage';

// The first page of the list is loaded here, before the route renders.  The component then reads it back from the Apollo
// cache with a query hook, which is what lets it page in more with fetchMore.
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  await apolloClient.query({ query: TagListPageQueryDocument, fetchPolicy: 'network-only' });
  return null;
}

export default function TagListPage(): JSX.Element {
  const { data, fetchMore } = useTagListPageQuery();

  const tags = !data ? [] : data.tags.edges.map((edge) => edge.node);

  return (
    <>
      <h1>Tags</h1>

      <Link to="/tags/new" className="btn btn-primary">
        New tag
      </Link>

      <ul className="list-unstyled my-4">
        {tags.map((tag, index) => (
          <div className="mb-1" key={tag.id}>
            <Tag tag={tag} linkTo={`/tags/${tag.id}/edit`} />
            {index === tags.length - 5 && (
              <Waypoint
                onEnter={() => {
                  if (data && data.tags.edges.length < data.tags.totalCount) {
                    fetchMore({
                      variables: {
                        after: data.tags.pageInfo.endCursor,
                      },
                    });
                  }
                }}
              />
            )}
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
