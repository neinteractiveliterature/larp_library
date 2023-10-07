/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ProjectHeadersFragmentDoc } from '../ProjectSearch/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BrandsPageQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type BrandsPageQueryData = {
  __typename: 'Query';
  brands: {
    __typename: 'BrandConnection';
    totalCount: number;
    pageInfo: { __typename: 'PageInfo'; endCursor?: string | null };
    edges: Array<{
      __typename: 'BrandEdge';
      node: {
        __typename: 'Brand';
        id: string;
        name: string;
        description?: string | null;
        slug: string;
        projects: { __typename: 'ProjectConnection'; totalCount: number };
      };
    }>;
  };
};

export type BrandPageBrandFieldsFragment = {
  __typename: 'Brand';
  id: string;
  approved?: boolean | null;
  name: string;
  description?: string | null;
  slug: string;
  currentUserCanEdit: boolean;
  currentUserCanCreateProjects: boolean;
};

export type BrandPageQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  projectsAfter?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type BrandPageQueryData = {
  __typename: 'Query';
  brand: {
    __typename: 'Brand';
    id: string;
    approved?: boolean | null;
    name: string;
    description?: string | null;
    slug: string;
    currentUserCanEdit: boolean;
    currentUserCanCreateProjects: boolean;
    projects: {
      __typename: 'ProjectConnection';
      totalCount: number;
      pageInfo: { __typename: 'PageInfo'; endCursor?: string | null };
      edges: Array<{
        __typename: 'ProjectEdge';
        node: {
          __typename: 'Project';
          id: string;
          description?: string | null;
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
    };
  };
};

export type NewBrandQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NewBrandQueryData = {
  __typename: 'Query';
  currentUser?: {
    __typename: 'User';
    id: string;
    name: string;
    brands: Array<{ __typename: 'Brand'; id: string; name: string; slug: string }>;
  } | null;
};

export type BrandMembershipFieldsFragment = {
  __typename: 'BrandMembership';
  id: string;
  admin: boolean;
  invitationEmail?: string | null;
  user?: { __typename: 'User'; id: string; name: string; email?: string | null } | null;
};

export type EditBrandQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type EditBrandQueryData = {
  __typename: 'Query';
  brand: {
    __typename: 'Brand';
    id: string;
    approved?: boolean | null;
    name: string;
    slug: string;
    description?: string | null;
    currentUserCanManageMemberships: boolean;
    brandMemberships: Array<{
      __typename: 'BrandMembership';
      id: string;
      admin: boolean;
      invitationEmail?: string | null;
      user?: { __typename: 'User'; id: string; name: string; email?: string | null } | null;
    }>;
  };
  currentUser?: { __typename: 'User'; id: string } | null;
};

export type UnapprovedBrandsListPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UnapprovedBrandsListPageQueryData = {
  __typename: 'Query';
  brands: {
    __typename: 'BrandConnection';
    edges: Array<{
      __typename: 'BrandEdge';
      node: {
        __typename: 'Brand';
        id: string;
        name: string;
        slug: string;
        createdAt: any;
        creator?: { __typename: 'User'; id: string; email?: string | null; name: string } | null;
      };
    }>;
  };
};

export const BrandPageBrandFieldsFragmentDoc = gql`
  fragment BrandPageBrandFields on Brand {
    id
    approved
    name
    description
    slug
    currentUserCanEdit
    currentUserCanCreateProjects
  }
`;
export const BrandMembershipFieldsFragmentDoc = gql`
  fragment BrandMembershipFields on BrandMembership {
    id
    admin
    invitationEmail
    user {
      id
      name
      email
    }
  }
`;
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
export function useBrandsPageQuery(
  baseOptions?: Apollo.QueryHookOptions<BrandsPageQueryData, BrandsPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BrandsPageQueryData, BrandsPageQueryVariables>(BrandsPageQueryDocument, options);
}
export function useBrandsPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BrandsPageQueryData, BrandsPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BrandsPageQueryData, BrandsPageQueryVariables>(BrandsPageQueryDocument, options);
}
export type BrandsPageQueryHookResult = ReturnType<typeof useBrandsPageQuery>;
export type BrandsPageQueryLazyQueryHookResult = ReturnType<typeof useBrandsPageQueryLazyQuery>;
export type BrandsPageQueryQueryResult = Apollo.QueryResult<BrandsPageQueryData, BrandsPageQueryVariables>;
export const BrandPageQueryDocument = gql`
  query BrandPageQuery($slug: String!, $projectsAfter: String) {
    brand(slug: $slug) {
      id
      ...BrandPageBrandFields
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
  ${BrandPageBrandFieldsFragmentDoc}
  ${ProjectHeadersFragmentDoc}
`;

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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BrandPageQueryData, BrandPageQueryVariables>(BrandPageQueryDocument, options);
}
export function useBrandPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BrandPageQueryData, BrandPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BrandPageQueryData, BrandPageQueryVariables>(BrandPageQueryDocument, options);
}
export type BrandPageQueryHookResult = ReturnType<typeof useBrandPageQuery>;
export type BrandPageQueryLazyQueryHookResult = ReturnType<typeof useBrandPageQueryLazyQuery>;
export type BrandPageQueryQueryResult = Apollo.QueryResult<BrandPageQueryData, BrandPageQueryVariables>;
export const NewBrandQueryDocument = gql`
  query NewBrandQuery {
    currentUser {
      id
      name
      brands {
        id
        name
        slug
      }
    }
  }
`;

/**
 * __useNewBrandQuery__
 *
 * To run a query within a React component, call `useNewBrandQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewBrandQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewBrandQuery({
 *   variables: {
 *   },
 * });
 */
export function useNewBrandQuery(baseOptions?: Apollo.QueryHookOptions<NewBrandQueryData, NewBrandQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NewBrandQueryData, NewBrandQueryVariables>(NewBrandQueryDocument, options);
}
export function useNewBrandQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NewBrandQueryData, NewBrandQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NewBrandQueryData, NewBrandQueryVariables>(NewBrandQueryDocument, options);
}
export type NewBrandQueryHookResult = ReturnType<typeof useNewBrandQuery>;
export type NewBrandQueryLazyQueryHookResult = ReturnType<typeof useNewBrandQueryLazyQuery>;
export type NewBrandQueryQueryResult = Apollo.QueryResult<NewBrandQueryData, NewBrandQueryVariables>;
export const EditBrandQueryDocument = gql`
  query EditBrandQuery($slug: String!) {
    brand(slug: $slug) {
      id
      approved
      name
      slug
      description
      currentUserCanManageMemberships
      brandMemberships {
        id
        ...BrandMembershipFields
      }
    }
    currentUser {
      id
    }
  }
  ${BrandMembershipFieldsFragmentDoc}
`;

/**
 * __useEditBrandQuery__
 *
 * To run a query within a React component, call `useEditBrandQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditBrandQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditBrandQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useEditBrandQuery(baseOptions: Apollo.QueryHookOptions<EditBrandQueryData, EditBrandQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EditBrandQueryData, EditBrandQueryVariables>(EditBrandQueryDocument, options);
}
export function useEditBrandQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EditBrandQueryData, EditBrandQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EditBrandQueryData, EditBrandQueryVariables>(EditBrandQueryDocument, options);
}
export type EditBrandQueryHookResult = ReturnType<typeof useEditBrandQuery>;
export type EditBrandQueryLazyQueryHookResult = ReturnType<typeof useEditBrandQueryLazyQuery>;
export type EditBrandQueryQueryResult = Apollo.QueryResult<EditBrandQueryData, EditBrandQueryVariables>;
export const UnapprovedBrandsListPageQueryDocument = gql`
  query UnapprovedBrandsListPageQuery {
    brands(unapproved: true) {
      edges {
        node {
          id
          name
          slug
          createdAt
          creator {
            id
            email
            name
          }
        }
      }
    }
  }
`;

/**
 * __useUnapprovedBrandsListPageQuery__
 *
 * To run a query within a React component, call `useUnapprovedBrandsListPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnapprovedBrandsListPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnapprovedBrandsListPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnapprovedBrandsListPageQuery(
  baseOptions?: Apollo.QueryHookOptions<UnapprovedBrandsListPageQueryData, UnapprovedBrandsListPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UnapprovedBrandsListPageQueryData, UnapprovedBrandsListPageQueryVariables>(
    UnapprovedBrandsListPageQueryDocument,
    options,
  );
}
export function useUnapprovedBrandsListPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UnapprovedBrandsListPageQueryData, UnapprovedBrandsListPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UnapprovedBrandsListPageQueryData, UnapprovedBrandsListPageQueryVariables>(
    UnapprovedBrandsListPageQueryDocument,
    options,
  );
}
export type UnapprovedBrandsListPageQueryHookResult = ReturnType<typeof useUnapprovedBrandsListPageQuery>;
export type UnapprovedBrandsListPageQueryLazyQueryHookResult = ReturnType<
  typeof useUnapprovedBrandsListPageQueryLazyQuery
>;
export type UnapprovedBrandsListPageQueryQueryResult = Apollo.QueryResult<
  UnapprovedBrandsListPageQueryData,
  UnapprovedBrandsListPageQueryVariables
>;
