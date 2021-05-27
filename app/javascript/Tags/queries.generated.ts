/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TagCategoryFragment } from '../TagCategories/TagCategoryFragment.generated';
import { gql } from '@apollo/client';
import { TagCategoryFragmentDoc } from '../TagCategories/TagCategoryFragment.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type TagFragment = { __typename: 'Tag' } & Pick<Types.Tag, 'id' | 'name'> & {
    tagCategory?: Types.Maybe<
      { __typename: 'TagCategory' } & Pick<Types.TagCategory, 'id'> & TagCategoryFragment
    >;
  };

export type TagAutocompleteQueryVariables = Types.Exact<{
  queryString?: Types.Maybe<Types.Scalars['String']>;
}>;

export type TagAutocompleteQueryData = { __typename: 'Query' } & {
  tags: { __typename: 'TagConnection' } & {
    edges: Array<
      { __typename: 'TagEdge' } & {
        node: { __typename: 'Tag' } & Pick<Types.Tag, 'id'> & TagFragment;
      }
    >;
  };
};

export type TagListPageQueryVariables = Types.Exact<{
  after?: Types.Maybe<Types.Scalars['String']>;
}>;

export type TagListPageQueryData = { __typename: 'Query' } & {
  tags: { __typename: 'TagConnection' } & Pick<Types.TagConnection, 'totalCount'> & {
      pageInfo: { __typename: 'PageInfo' } & Pick<Types.PageInfo, 'endCursor'>;
      edges: Array<
        { __typename: 'TagEdge' } & {
          node: { __typename: 'Tag' } & Pick<Types.Tag, 'id'> & TagFragment;
        }
      >;
    };
};

export type EditTagQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type EditTagQueryData = { __typename: 'Query' } & {
  tag: { __typename: 'Tag' } & Pick<Types.Tag, 'id'> & {
      projects: { __typename: 'ProjectConnection' } & Pick<Types.ProjectConnection, 'totalCount'>;
    } & TagFragment;
};

export const TagFragmentDoc = gql`
  fragment TagFragment on Tag {
    id
    name
    tagCategory {
      id
      ...TagCategoryFragment
    }
  }
  ${TagCategoryFragmentDoc}
`;
export const TagAutocompleteQueryDocument = gql`
  query TagAutocompleteQuery($queryString: String) {
    tags(queryString: $queryString) {
      edges {
        node {
          id
          ...TagFragment
        }
      }
    }
  }
  ${TagFragmentDoc}
`;

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
export function useTagAutocompleteQuery(
  baseOptions?: Apollo.QueryHookOptions<TagAutocompleteQueryData, TagAutocompleteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TagAutocompleteQueryData, TagAutocompleteQueryVariables>(
    TagAutocompleteQueryDocument,
    options,
  );
}
export function useTagAutocompleteQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TagAutocompleteQueryData,
    TagAutocompleteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TagAutocompleteQueryData, TagAutocompleteQueryVariables>(
    TagAutocompleteQueryDocument,
    options,
  );
}
export type TagAutocompleteQueryHookResult = ReturnType<typeof useTagAutocompleteQuery>;
export type TagAutocompleteQueryLazyQueryHookResult = ReturnType<
  typeof useTagAutocompleteQueryLazyQuery
>;
export type TagAutocompleteQueryQueryResult = Apollo.QueryResult<
  TagAutocompleteQueryData,
  TagAutocompleteQueryVariables
>;
export const TagListPageQueryDocument = gql`
  query TagListPageQuery($after: String) {
    tags(first: 25, after: $after) {
      pageInfo {
        endCursor
      }
      totalCount
      edges {
        node {
          id
          ...TagFragment
        }
      }
    }
  }
  ${TagFragmentDoc}
`;

/**
 * __useTagListPageQuery__
 *
 * To run a query within a React component, call `useTagListPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagListPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagListPageQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTagListPageQuery(
  baseOptions?: Apollo.QueryHookOptions<TagListPageQueryData, TagListPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TagListPageQueryData, TagListPageQueryVariables>(
    TagListPageQueryDocument,
    options,
  );
}
export function useTagListPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TagListPageQueryData, TagListPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TagListPageQueryData, TagListPageQueryVariables>(
    TagListPageQueryDocument,
    options,
  );
}
export type TagListPageQueryHookResult = ReturnType<typeof useTagListPageQuery>;
export type TagListPageQueryLazyQueryHookResult = ReturnType<typeof useTagListPageQueryLazyQuery>;
export type TagListPageQueryQueryResult = Apollo.QueryResult<
  TagListPageQueryData,
  TagListPageQueryVariables
>;
export const EditTagQueryDocument = gql`
  query EditTagQuery($id: ID!) {
    tag(id: $id) {
      id
      ...TagFragment
      projects {
        totalCount
      }
    }
  }
  ${TagFragmentDoc}
`;

/**
 * __useEditTagQuery__
 *
 * To run a query within a React component, call `useEditTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditTagQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditTagQuery(
  baseOptions: Apollo.QueryHookOptions<EditTagQueryData, EditTagQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EditTagQueryData, EditTagQueryVariables>(EditTagQueryDocument, options);
}
export function useEditTagQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EditTagQueryData, EditTagQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EditTagQueryData, EditTagQueryVariables>(
    EditTagQueryDocument,
    options,
  );
}
export type EditTagQueryHookResult = ReturnType<typeof useEditTagQuery>;
export type EditTagQueryLazyQueryHookResult = ReturnType<typeof useEditTagQueryLazyQuery>;
export type EditTagQueryQueryResult = Apollo.QueryResult<EditTagQueryData, EditTagQueryVariables>;
