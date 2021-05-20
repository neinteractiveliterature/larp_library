/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { ProjectHeadersFragment } from '../ProjectSearch/queries.generated';
import { gql } from '@apollo/client';
import { ProjectHeadersFragmentDoc } from '../ProjectSearch/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type BrandsPageQueryVariables = Types.Exact<{
  after?: Types.Maybe<Types.Scalars['String']>;
}>;


export type BrandsPageQueryData = (
  { __typename: 'Query' }
  & { brands: (
    { __typename: 'BrandConnection' }
    & Pick<Types.BrandConnection, 'totalCount'>
    & { pageInfo: (
      { __typename: 'PageInfo' }
      & Pick<Types.PageInfo, 'endCursor'>
    ), edges: Array<(
      { __typename: 'BrandEdge' }
      & { node: (
        { __typename: 'Brand' }
        & Pick<Types.Brand, 'id' | 'name' | 'description' | 'slug'>
        & { projects: (
          { __typename: 'ProjectConnection' }
          & Pick<Types.ProjectConnection, 'totalCount'>
        ) }
      ) }
    )> }
  ) }
);

export type BrandPageQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  projectsAfter?: Types.Maybe<Types.Scalars['String']>;
}>;


export type BrandPageQueryData = (
  { __typename: 'Query' }
  & { brand: (
    { __typename: 'Brand' }
    & Pick<Types.Brand, 'id' | 'name' | 'description' | 'slug' | 'currentUserCanEdit' | 'currentUserCanCreateProjects'>
    & { projects: (
      { __typename: 'ProjectConnection' }
      & Pick<Types.ProjectConnection, 'totalCount'>
      & { pageInfo: (
        { __typename: 'PageInfo' }
        & Pick<Types.PageInfo, 'endCursor'>
      ), edges: Array<(
        { __typename: 'ProjectEdge' }
        & { node: (
          { __typename: 'Project' }
          & Pick<Types.Project, 'id' | 'description'>
          & ProjectHeadersFragment
        ) }
      )> }
    ) }
  ) }
);


export const BrandsPageQueryDocument = gql`
    query BrandsPageQuery($after: String) {
  brands(after: $after) {
    pageInfo {
      endCursor
    }
    totalCount
    edges {
      node {
        id
        name
        description
        slug
        projects {
          totalCount
        }
      }
    }
  }
}
    `;

/**
 * __useBrandsPageQuery__
 *
 * To run a query within a React component, call `useBrandsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useBrandsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBrandsPageQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function useBrandsPageQuery(baseOptions?: Apollo.QueryHookOptions<BrandsPageQueryData, BrandsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BrandsPageQueryData, BrandsPageQueryVariables>(BrandsPageQueryDocument, options);
      }
export function useBrandsPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BrandsPageQueryData, BrandsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BrandsPageQueryData, BrandsPageQueryVariables>(BrandsPageQueryDocument, options);
        }
export type BrandsPageQueryHookResult = ReturnType<typeof useBrandsPageQuery>;
export type BrandsPageQueryLazyQueryHookResult = ReturnType<typeof useBrandsPageQueryLazyQuery>;
export type BrandsPageQueryQueryResult = Apollo.QueryResult<BrandsPageQueryData, BrandsPageQueryVariables>;
export const BrandPageQueryDocument = gql`
    query BrandPageQuery($slug: String!, $projectsAfter: String) {
  brand(slug: $slug) {
    id
    name
    description
    slug
    currentUserCanEdit
    currentUserCanCreateProjects
    projects(after: $projectsAfter) {
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
  }
}
    ${ProjectHeadersFragmentDoc}`;

/**
 * __useBrandPageQuery__
 *
 * To run a query within a React component, call `useBrandPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useBrandPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBrandPageQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      projectsAfter: // value for 'projectsAfter'
 *   },
 * });
 */
export function useBrandPageQuery(baseOptions: Apollo.QueryHookOptions<BrandPageQueryData, BrandPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BrandPageQueryData, BrandPageQueryVariables>(BrandPageQueryDocument, options);
      }
export function useBrandPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BrandPageQueryData, BrandPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BrandPageQueryData, BrandPageQueryVariables>(BrandPageQueryDocument, options);
        }
export type BrandPageQueryHookResult = ReturnType<typeof useBrandPageQuery>;
export type BrandPageQueryLazyQueryHookResult = ReturnType<typeof useBrandPageQueryLazyQuery>;
export type BrandPageQueryQueryResult = Apollo.QueryResult<BrandPageQueryData, BrandPageQueryVariables>;