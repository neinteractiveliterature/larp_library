/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppLayoutQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AppLayoutQueryData = {
  __typename: 'Query';
  currentUser?: { __typename: 'User'; id: string; admin?: boolean | null } | null;
  currentAbility: {
    __typename: 'Ability';
    canCreateProjectPromotions: boolean;
    canUpdateTags: boolean;
    canUpdateTagCategories: boolean;
  };
};

export const AppLayoutQueryDocument = gql`
  query AppLayoutQuery {
    currentUser {
      id
      admin
    }
    currentAbility {
      canCreateProjectPromotions
      canUpdateTags
      canUpdateTagCategories
    }
  }
`;

/**
 * __useAppLayoutQuery__
 *
 * To run a query within a React component, call `useAppLayoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppLayoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppLayoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppLayoutQuery(baseOptions?: Apollo.QueryHookOptions<AppLayoutQueryData, AppLayoutQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppLayoutQueryData, AppLayoutQueryVariables>(AppLayoutQueryDocument, options);
}
export function useAppLayoutQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppLayoutQueryData, AppLayoutQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppLayoutQueryData, AppLayoutQueryVariables>(AppLayoutQueryDocument, options);
}
export type AppLayoutQueryHookResult = ReturnType<typeof useAppLayoutQuery>;
export type AppLayoutQueryLazyQueryHookResult = ReturnType<typeof useAppLayoutQueryLazyQuery>;
export type AppLayoutQueryQueryResult = Apollo.QueryResult<AppLayoutQueryData, AppLayoutQueryVariables>;
