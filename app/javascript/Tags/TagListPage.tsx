import { Link } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import { useTagListPageQuery } from './queries.generated';
import Tag from './Tag';

export default function TagListPage(): JSX.Element {
  const { data, loading, error, fetchMore } = useTagListPageQuery();

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
