/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ProjectHeadersFragmentDoc } from '../ProjectSearch/queries.generated';
import { TagFragmentDoc } from '../Tags/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HomePageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type HomePageQueryData = {
  __typename: 'Query';
  projectPromotions: Array<{
    __typename: 'ProjectPromotion';
    id: string;
    project: {
      __typename: 'Project';
      id: string;
      title?: string | null;
      authors?: string | null;
      minPlayers?: number | null;
      maxPlayers?: number | null;
      minFacilitators?: number | null;
      maxFacilitators?: number | null;
      publicationYear?: number | null;
      lengthQuantity?: number | null;
      lengthUnits?: string | null;
      brand: { __typename: 'Brand'; id: string; name: string; slug: string };
      tags: Array<{
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: {
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: string | null;
          textColor?: string | null;
          icon?: string | null;
        } | null;
      }>;
    };
  }>;
  tags: {
    __typename: 'TagConnection';
    edges: Array<{
      __typename: 'TagEdge';
      node: {
        __typename: 'Tag';
        id: string;
        name: string;
        projects: { __typename: 'ProjectConnection'; totalCount: number };
        tagCategory?: {
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: string | null;
          textColor?: string | null;
          icon?: string | null;
        } | null;
      };
    }>;
  };
  tagCategories: {
    __typename: 'TagCategoryConnection';
    edges: Array<{
      __typename: 'TagCategoryEdge';
      node: {
        __typename: 'TagCategory';
        id: string;
        name: string;
        tags: Array<{
          __typename: 'Tag';
          id: string;
          name: string;
          tagCategory?: {
            __typename: 'TagCategory';
            id: string;
            name: string;
            color?: string | null;
            textColor?: string | null;
            icon?: string | null;
          } | null;
        }>;
      };
    }>;
  };
};

export const HomePageQueryDocument = gql`
  query HomePageQuery {
    projectPromotions {
      id
      project {
        ...ProjectHeadersFragment
      }
    }
    tags(first: 200) {
      edges {
        node {
          id
          ...TagFragment
          projects {
            totalCount
          }
        }
      }
    }
    tagCategories {
      edges {
        node {
          id
          name
          tags {
            id
            ...TagFragment
          }
        }
      }
    }
  }
  ${ProjectHeadersFragmentDoc}
  ${TagFragmentDoc}
`;

/**
 * __useHomePageQuery__
 *
 * To run a query within a React component, call `useHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageQuery(baseOptions?: Apollo.QueryHookOptions<HomePageQueryData, HomePageQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomePageQueryData, HomePageQueryVariables>(HomePageQueryDocument, options);
}
export function useHomePageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HomePageQueryData, HomePageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomePageQueryData, HomePageQueryVariables>(HomePageQueryDocument, options);
}
export type HomePageQueryHookResult = ReturnType<typeof useHomePageQuery>;
export type HomePageQueryLazyQueryHookResult = ReturnType<typeof useHomePageQueryLazyQuery>;
export type HomePageQueryQueryResult = Apollo.QueryResult<HomePageQueryData, HomePageQueryVariables>;
