/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type TagCategoryFragment = { __typename: 'TagCategory' } & Pick<
  Types.TagCategory,
  'id' | 'name' | 'color' | 'textColor' | 'icon'
>;

export type TagCategoryAutocompleteQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
}>;

export type TagCategoryAutocompleteQueryData = { __typename: 'Query' } & {
  tagCategories: { __typename: 'TagCategoryConnection' } & {
    edges: Array<
      { __typename: 'TagCategoryEdge' } & {
        node: { __typename: 'TagCategory' } & Pick<Types.TagCategory, 'id'> & TagCategoryFragment;
      }
    >;
  };
};

export const TagCategoryFragmentDoc = gql`
  fragment TagCategoryFragment on TagCategory {
    id
    name
    color
    textColor
    icon
  }
`;
export const TagCategoryAutocompleteQueryDocument = gql`
  query TagCategoryAutocompleteQuery($queryString: String) {
    tagCategories(queryString: $queryString) {
      edges {
        node {
          id
          ...TagCategoryFragment
        }
      }
    }
  }
  ${TagCategoryFragmentDoc}
`;

/**
 * __useTagCategoryAutocompleteQuery__
 *
 * To run a query within a React component, call `useTagCategoryAutocompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagCategoryAutocompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagCategoryAutocompleteQuery({
 *   variables: {
 *      queryString: // value for 'queryString'
 *   },
 * });
 */
export function useTagCategoryAutocompleteQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TagCategoryAutocompleteQueryData,
    TagCategoryAutocompleteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TagCategoryAutocompleteQueryData, TagCategoryAutocompleteQueryVariables>(
    TagCategoryAutocompleteQueryDocument,
    options,
  );
}
export function useTagCategoryAutocompleteQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TagCategoryAutocompleteQueryData,
    TagCategoryAutocompleteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TagCategoryAutocompleteQueryData,
    TagCategoryAutocompleteQueryVariables
  >(TagCategoryAutocompleteQueryDocument, options);
}
export type TagCategoryAutocompleteQueryHookResult = ReturnType<
  typeof useTagCategoryAutocompleteQuery
>;
export type TagCategoryAutocompleteQueryLazyQueryHookResult = ReturnType<
  typeof useTagCategoryAutocompleteQueryLazyQuery
>;
export type TagCategoryAutocompleteQueryQueryResult = Apollo.QueryResult<
  TagCategoryAutocompleteQueryData,
  TagCategoryAutocompleteQueryVariables
>;
