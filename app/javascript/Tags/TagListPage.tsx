import type { JSX } from 'react';
import { Link } from 'react-router';
import { Waypoint } from '../Waypoint';
import { useTagListPageQuery } from './queries.generated';
import Tag from './Tag';
import { pageTitle } from '../pageTitle';

export default function TagListPage(): JSX.Element {
  const { data, loading, error, fetchMore } = useTagListPageQuery({ fetchPolicy: 'network-only' });

  const tags = loading || error || !data ? [] : data.tags.edges.map((edge) => edge.node);

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
