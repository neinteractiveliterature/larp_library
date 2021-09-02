/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type ProjectPromotionFieldsFragment = {
  __typename: 'ProjectPromotion';
  id: string;
  createdAt: any;
  project: {
    __typename: 'Project';
    id: string;
    title?: Types.Maybe<string>;
    brand: { __typename: 'Brand'; id: string; slug: string };
  };
};

export type ProjectPromotionsPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ProjectPromotionsPageQueryData = {
  __typename: 'Query';
  projectPromotions: Array<{
    __typename: 'ProjectPromotion';
    id: string;
    createdAt: any;
    project: {
      __typename: 'Project';
      id: string;
      title?: Types.Maybe<string>;
      brand: { __typename: 'Brand'; id: string; slug: string };
    };
  }>;
};

export const ProjectPromotionFieldsFragmentDoc = gql`
  fragment ProjectPromotionFields on ProjectPromotion {
    id
    createdAt
    project {
      id
      title
      brand {
        id
        slug
      }
    }
  }
`;
export const ProjectPromotionsPageQueryDocument = gql`
  query ProjectPromotionsPageQuery {
    projectPromotions {
      id
      ...ProjectPromotionFields
    }
  }
  ${ProjectPromotionFieldsFragmentDoc}
`;

/**
 * __useProjectPromotionsPageQuery__
 *
 * To run a query within a React component, call `useProjectPromotionsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectPromotionsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectPromotionsPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useProjectPromotionsPageQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ProjectPromotionsPageQueryData,
    ProjectPromotionsPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProjectPromotionsPageQueryData, ProjectPromotionsPageQueryVariables>(
    ProjectPromotionsPageQueryDocument,
    options,
  );
}
export function useProjectPromotionsPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProjectPromotionsPageQueryData,
    ProjectPromotionsPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectPromotionsPageQueryData, ProjectPromotionsPageQueryVariables>(
    ProjectPromotionsPageQueryDocument,
    options,
  );
}
export type ProjectPromotionsPageQueryHookResult = ReturnType<typeof useProjectPromotionsPageQuery>;
export type ProjectPromotionsPageQueryLazyQueryHookResult = ReturnType<
  typeof useProjectPromotionsPageQueryLazyQuery
>;
export type ProjectPromotionsPageQueryQueryResult = Apollo.QueryResult<
  ProjectPromotionsPageQueryData,
  ProjectPromotionsPageQueryVariables
>;
