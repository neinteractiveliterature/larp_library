/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TagFragment = (
  { __typename: 'Tag' }
  & Pick<Types.Tag, 'id' | 'name'>
  & { tagCategory?: Types.Maybe<(
    { __typename: 'TagCategory' }
    & Pick<Types.TagCategory, 'name' | 'color' | 'textColor' | 'icon'>
  )> }
);

export type TagAutocompleteQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
}>;


export type TagAutocompleteQueryData = (
  { __typename: 'Query' }
  & { tags: (
    { __typename: 'TagConnection' }
    & { nodes: Array<(
      { __typename: 'Tag' }
      & Pick<Types.Tag, 'id'>
      & TagFragment
    )> }
  ) }
);

export const TagFragmentDoc = gql`
    fragment TagFragment on Tag {
  id
  name
  tagCategory {
    name
    color
    textColor
    icon
  }
}
    `;
export const TagAutocompleteQueryDocument = gql`
    query TagAutocompleteQuery($queryString: String) {
  tags(queryString: $queryString) {
    nodes {
      id
      ...TagFragment
    }
  }
}
    ${TagFragmentDoc}`;

/**
 * __useTagAutocompleteQuery__
 *
 * To run a query within a React component, call `useTagAutocompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagAutocompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagAutocompleteQuery({
 *   variables: {
 *      queryString: // value for 'queryString'
 *   },
 * });
 */
export function useTagAutocompleteQuery(baseOptions?: Apollo.QueryHookOptions<TagAutocompleteQueryData, TagAutocompleteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagAutocompleteQueryData, TagAutocompleteQueryVariables>(TagAutocompleteQueryDocument, options);
      }
export function useTagAutocompleteQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagAutocompleteQueryData, TagAutocompleteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagAutocompleteQueryData, TagAutocompleteQueryVariables>(TagAutocompleteQueryDocument, options);
        }
export type TagAutocompleteQueryHookResult = ReturnType<typeof useTagAutocompleteQuery>;
export type TagAutocompleteQueryLazyQueryHookResult = ReturnType<typeof useTagAutocompleteQueryLazyQuery>;
export type TagAutocompleteQueryQueryResult = Apollo.QueryResult<TagAutocompleteQueryData, TagAutocompleteQueryVariables>;