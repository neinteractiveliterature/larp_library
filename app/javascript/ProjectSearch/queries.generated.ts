/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TagFragment } from '../Tags/queries.generated';
import { gql } from '@apollo/client';
import { TagFragmentDoc } from '../Tags/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type ProjectHeadersFragment = { __typename: 'Project' } & Pick<
  Types.Project,
  | 'id'
  | 'title'
  | 'authors'
  | 'minPlayers'
  | 'maxPlayers'
  | 'publicationYear'
  | 'lengthQuantity'
  | 'lengthUnits'
> & {
    brand: { __typename: 'Brand' } & Pick<Types.Brand, 'id' | 'name' | 'slug'>;
    tags: Array<{ __typename: 'Tag' } & Pick<Types.Tag, 'id'> & TagFragment>;
  };

export type ProjectSearchQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
  tag?: Types.Maybe<Types.Scalars['String']>;
  title?: Types.Maybe<Types.Scalars['String']>;
  authors?: Types.Maybe<Types.Scalars['String']>;
  playerCountUpperBound?: Types.Maybe<Types.Scalars['Int']>;
  playerCountLowerBound?: Types.Maybe<Types.Scalars['Int']>;
  after?: Types.Maybe<Types.Scalars['String']>;
}>;

export type ProjectSearchQueryData = { __typename: 'Query' } & {
  projects: { __typename: 'ProjectConnection' } & Pick<Types.ProjectConnection, 'totalCount'> & {
      pageInfo: { __typename: 'PageInfo' } & Pick<Types.PageInfo, 'endCursor'>;
      edges: Array<
        { __typename: 'ProjectEdge' } & {
          node: { __typename: 'Project' } & Pick<Types.Project, 'id' | 'description'> &
            ProjectHeadersFragment;
        }
      >;
    };
  tagByName?: Types.Maybe<{ __typename: 'Tag' } & Pick<Types.Tag, 'id'> & TagFragment>;
};

export const ProjectHeadersFragmentDoc = gql`
  fragment ProjectHeadersFragment on Project {
    id
    title
    authors
    minPlayers
    maxPlayers
    publicationYear
    lengthQuantity
    lengthUnits
    brand {
      id
      name
      slug
    }
    tags {
      id
      ...TagFragment
    }
  }
  ${TagFragmentDoc}
`;
export const ProjectSearchQueryDocument = gql`
  query ProjectSearchQuery(
    $queryString: String
    $tag: String
    $title: String
    $authors: String
    $playerCountUpperBound: Int
    $playerCountLowerBound: Int
    $after: String
  ) {
    projects(
      queryString: $queryString
      tag: $tag
      title: $title
      authors: $authors
      playerCountUpperBound: $playerCountUpperBound
      playerCountLowerBound: $playerCountLowerBound
      after: $after
    ) {
      pageInfo {
        endCursor
      }
      totalCount
      edges {
        node {
          id
          description
          ...ProjectHeadersFragment
        }
      }
    }
    tagByName(name: $tag) {
      id
      ...TagFragment
    }
  }
  ${ProjectHeadersFragmentDoc}
  ${TagFragmentDoc}
`;

/**
 * __useProjectSearchQuery__
 *
 * To run a query within a React component, call `useProjectSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectSearchQuery({
 *   variables: {
 *      queryString: // value for 'queryString'
 *      tag: // value for 'tag'
 *      title: // value for 'title'
 *      authors: // value for 'authors'
 *      playerCountUpperBound: // value for 'playerCountUpperBound'
 *      playerCountLowerBound: // value for 'playerCountLowerBound'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useProjectSearchQuery(
  baseOptions?: Apollo.QueryHookOptions<ProjectSearchQueryData, ProjectSearchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProjectSearchQueryData, ProjectSearchQueryVariables>(
    ProjectSearchQueryDocument,
    options,
  );
}
export function useProjectSearchQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectSearchQueryData, ProjectSearchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectSearchQueryData, ProjectSearchQueryVariables>(
    ProjectSearchQueryDocument,
    options,
  );
}
export type ProjectSearchQueryHookResult = ReturnType<typeof useProjectSearchQuery>;
export type ProjectSearchQueryLazyQueryHookResult = ReturnType<
  typeof useProjectSearchQueryLazyQuery
>;
export type ProjectSearchQueryQueryResult = Apollo.QueryResult<
  ProjectSearchQueryData,
  ProjectSearchQueryVariables
>;
