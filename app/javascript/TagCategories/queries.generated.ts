/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { TagCategoryFragmentDoc } from './TagCategoryFragment.generated';
import { TagFragmentDoc } from '../Tags/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type TagCategoryAutocompleteQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
}>;

export type TagCategoryAutocompleteQueryData = {
  __typename: 'Query';
  tagCategories: {
    __typename: 'TagCategoryConnection';
    edges: Array<{
      __typename: 'TagCategoryEdge';
      node: {
        __typename: 'TagCategory';
        id: string;
        name: string;
        color?: Types.Maybe<string>;
        textColor?: Types.Maybe<string>;
        icon?: Types.Maybe<string>;
      };
    }>;
  };
};

export type TagCategoryListPageQueryVariables = Types.Exact<{
  after?: Types.Maybe<Types.Scalars['String']>;
}>;

export type TagCategoryListPageQueryData = {
  __typename: 'Query';
  tagCategories: {
    __typename: 'TagCategoryConnection';
    totalCount: number;
    pageInfo: { __typename: 'PageInfo'; endCursor?: Types.Maybe<string> };
    edges: Array<{
      __typename: 'TagCategoryEdge';
      node: {
        __typename: 'TagCategory';
        id: string;
        name: string;
        color?: Types.Maybe<string>;
        textColor?: Types.Maybe<string>;
        icon?: Types.Maybe<string>;
      };
    }>;
  };
};

export type EditTagCategoryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type EditTagCategoryQueryData = {
  __typename: 'Query';
  tagCategory: {
    __typename: 'TagCategory';
    id: string;
    name: string;
    color?: Types.Maybe<string>;
    textColor?: Types.Maybe<string>;
    icon?: Types.Maybe<string>;
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
};

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
export const TagCategoryListPageQueryDocument = gql`
  query TagCategoryListPageQuery($after: String) {
    tagCategories(first: 25, after: $after) {
      pageInfo {
        endCursor
      }
      totalCount
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
 * __useTagCategoryListPageQuery__
 *
 * To run a query within a React component, call `useTagCategoryListPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagCategoryListPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagCategoryListPageQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTagCategoryListPageQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TagCategoryListPageQueryData,
    TagCategoryListPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TagCategoryListPageQueryData, TagCategoryListPageQueryVariables>(
    TagCategoryListPageQueryDocument,
    options,
  );
}
export function useTagCategoryListPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TagCategoryListPageQueryData,
    TagCategoryListPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TagCategoryListPageQueryData, TagCategoryListPageQueryVariables>(
    TagCategoryListPageQueryDocument,
    options,
  );
}
export type TagCategoryListPageQueryHookResult = ReturnType<typeof useTagCategoryListPageQuery>;
export type TagCategoryListPageQueryLazyQueryHookResult = ReturnType<
  typeof useTagCategoryListPageQueryLazyQuery
>;
export type TagCategoryListPageQueryQueryResult = Apollo.QueryResult<
  TagCategoryListPageQueryData,
  TagCategoryListPageQueryVariables
>;
export const EditTagCategoryQueryDocument = gql`
  query EditTagCategoryQuery($id: ID!) {
    tagCategory(id: $id) {
      id
      ...TagCategoryFragment
      tags {
        ...TagFragment
      }
    }
  }
  ${TagCategoryFragmentDoc}
  ${TagFragmentDoc}
`;

/**
 * __useEditTagCategoryQuery__
 *
 * To run a query within a React component, call `useEditTagCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditTagCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditTagCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditTagCategoryQuery(
  baseOptions: Apollo.QueryHookOptions<EditTagCategoryQueryData, EditTagCategoryQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EditTagCategoryQueryData, EditTagCategoryQueryVariables>(
    EditTagCategoryQueryDocument,
    options,
  );
}
export function useEditTagCategoryQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    EditTagCategoryQueryData,
    EditTagCategoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EditTagCategoryQueryData, EditTagCategoryQueryVariables>(
    EditTagCategoryQueryDocument,
    options,
  );
}
export type EditTagCategoryQueryHookResult = ReturnType<typeof useEditTagCategoryQuery>;
export type EditTagCategoryQueryLazyQueryHookResult = ReturnType<
  typeof useEditTagCategoryQueryLazyQuery
>;
export type EditTagCategoryQueryQueryResult = Apollo.QueryResult<
  EditTagCategoryQueryData,
  EditTagCategoryQueryVariables
>;
