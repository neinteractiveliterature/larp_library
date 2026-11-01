import type { JSX } from 'react';
import { Link } from 'react-router';
import { Waypoint } from '../Waypoint';
import { useTagCategoryListPageQuery } from './queries.generated';
import TagCategory from './TagCategory';
import { pageTitle } from '../pageTitle';

export default function TagCategoryListPage(): JSX.Element {
  const { data, loading, error, fetchMore } = useTagCategoryListPageQuery({
    fetchPolicy: 'network-only',
  });

  const tagCategories = loading || error || !data ? [] : data.tagCategories.edges.map((edge) => edge.node);

  return (
    <>
      <h1>Tag categories</h1>

      <Link to="/tag_categories/new" className="btn btn-primary">
        New tag category
      </Link>

      <ul className="list-unstyled my-4">
        {tagCategories.map((tagCategory, index) => (
          <div className="mb-1" key={tagCategory.id}>
            <TagCategory tagCategory={tagCategory} linkTo={`/tag_categories/${tagCategory.id}/edit`} />
            {index === tagCategories.length - 5 && (
              <Waypoint
                onEnter={() => {
                  if (data && data.tagCategories.edges.length < data.tagCategories.totalCount) {
                    fetchMore({
                      variables: {
                        after: data.tagCategories.pageInfo.endCursor,
                      },
                    });
                  }
                }}
              />
            )}
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
