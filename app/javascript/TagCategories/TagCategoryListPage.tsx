import type { JSX } from 'react';
import { Link } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { Waypoint } from '../Waypoint';
import {
  TagCategoryListPageQueryDocument,
  useTagCategoryListPageQuery,
  type TagCategoryListPageQueryData,
  type TagCategoryListPageQueryVariables,
} from './queries.generated';
import TagCategory from './TagCategory';
import { pageTitle } from '../pageTitle';
import type { Route } from './+types/TagCategoryListPage';

// The first page of the list is loaded here, before the route renders.  The component then reads it back from the Apollo
// cache with a query hook, which is what lets it page in more with fetchMore.
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  await loadQuery<TagCategoryListPageQueryData, TagCategoryListPageQueryVariables>(
    apolloClient,
    TagCategoryListPageQueryDocument,
  );
  return null;
}

export default function TagCategoryListPage(): JSX.Element {
  const { data, fetchMore } = useTagCategoryListPageQuery();

  const tagCategories = !data ? [] : data.tagCategories.edges.map((edge) => edge.node);

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
