/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { TagFragmentDoc } from '../Tags/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type ProjectHeadersFragment = {
  __typename: 'Project';
  id: string;
  title?: Types.Maybe<string>;
  authors?: Types.Maybe<string>;
  minPlayers?: Types.Maybe<number>;
  maxPlayers?: Types.Maybe<number>;
  minFacilitators?: Types.Maybe<number>;
  maxFacilitators?: Types.Maybe<number>;
  publicationYear?: Types.Maybe<number>;
  lengthQuantity?: Types.Maybe<number>;
  lengthUnits?: Types.Maybe<string>;
  brand: { __typename: 'Brand'; id: string; name: string; slug: string };
  tags: Array<{
    __typename: 'Tag';
    id: string;
    name: string;
    tagCategory?: Types.Maybe<{
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: Types.Maybe<string>;
      textColor?: Types.Maybe<string>;
      icon?: Types.Maybe<string>;
    }>;
  }>;
};

export type ProjectSearchQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
  tag?: Types.Maybe<Types.Scalars['String']>;
  title?: Types.Maybe<Types.Scalars['String']>;
  authors?: Types.Maybe<Types.Scalars['String']>;
  playerCountUpperBound?: Types.Maybe<Types.Scalars['Int']>;
  playerCountLowerBound?: Types.Maybe<Types.Scalars['Int']>;
  facilitatorCountUpperBound?: Types.Maybe<Types.Scalars['Int']>;
  facilitatorCountLowerBound?: Types.Maybe<Types.Scalars['Int']>;
  after?: Types.Maybe<Types.Scalars['String']>;
}>;

export type ProjectSearchQueryData = {
  __typename: 'Query';
  projects: {
    __typename: 'ProjectConnection';
    totalCount: number;
    pageInfo: { __typename: 'PageInfo'; endCursor?: Types.Maybe<string> };
    edges: Array<{
      __typename: 'ProjectEdge';
      node: {
        __typename: 'Project';
        id: string;
        description?: Types.Maybe<string>;
        title?: Types.Maybe<string>;
        authors?: Types.Maybe<string>;
        minPlayers?: Types.Maybe<number>;
        maxPlayers?: Types.Maybe<number>;
        minFacilitators?: Types.Maybe<number>;
        maxFacilitators?: Types.Maybe<number>;
        publicationYear?: Types.Maybe<number>;
        lengthQuantity?: Types.Maybe<number>;
        lengthUnits?: Types.Maybe<string>;
        brand: { __typename: 'Brand'; id: string; name: string; slug: string };
        tags: Array<{
          __typename: 'Tag';
          id: string;
          name: string;
          tagCategory?: Types.Maybe<{
            __typename: 'TagCategory';
            id: string;
            name: string;
            color?: Types.Maybe<string>;
            textColor?: Types.Maybe<string>;
            icon?: Types.Maybe<string>;
          }>;
        }>;
      };
    }>;
  };
  tagByName?: Types.Maybe<{
    __typename: 'Tag';
    id: string;
    name: string;
    tagCategory?: Types.Maybe<{
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: Types.Maybe<string>;
      textColor?: Types.Maybe<string>;
      icon?: Types.Maybe<string>;
    }>;
  }>;
};

export const ProjectHeadersFragmentDoc = gql`
  fragment ProjectHeadersFragment on Project {
    id
    title
    authors
    minPlayers
    maxPlayers
    minFacilitators
    maxFacilitators
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
    $facilitatorCountUpperBound: Int
    $facilitatorCountLowerBound: Int
    $after: String
  ) {
    projects(
      queryString: $queryString
      tag: $tag
      title: $title
      authors: $authors
      playerCountUpperBound: $playerCountUpperBound
      playerCountLowerBound: $playerCountLowerBound
      facilitatorCountUpperBound: $facilitatorCountUpperBound
      facilitatorCountLowerBound: $facilitatorCountLowerBound
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
 *      facilitatorCountUpperBound: // value for 'facilitatorCountUpperBound'
 *      facilitatorCountLowerBound: // value for 'facilitatorCountLowerBound'
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
