/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type InvitationPageQueryVariables = Types.Exact<{
  brandSlug: Types.Scalars['String'];
  invitationToken: Types.Scalars['String'];
}>;

export type InvitationPageQueryData = {
  __typename: 'Query';
  brandMembership: {
    __typename: 'BrandMembership';
    id: string;
    admin: boolean;
    brand: { __typename: 'Brand'; id: string; name: string; slug: string };
  };
  currentUser?: { __typename: 'User'; id: string } | null;
};

export const InvitationPageQueryDocument = gql`
  query InvitationPageQuery($brandSlug: String!, $invitationToken: String!) {
    brandMembership(brandSlug: $brandSlug, invitationToken: $invitationToken) {
      id
      admin
      brand {
        id
        name
        slug
      }
    }
    currentUser {
      id
    }
  }
`;

/**
 * __useInvitationPageQuery__
 *
 * To run a query within a React component, call `useInvitationPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvitationPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvitationPageQuery({
 *   variables: {
 *      brandSlug: // value for 'brandSlug'
 *      invitationToken: // value for 'invitationToken'
 *   },
 * });
 */
export function useInvitationPageQuery(
  baseOptions: Apollo.QueryHookOptions<InvitationPageQueryData, InvitationPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<InvitationPageQueryData, InvitationPageQueryVariables>(InvitationPageQueryDocument, options);
}
export function useInvitationPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InvitationPageQueryData, InvitationPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<InvitationPageQueryData, InvitationPageQueryVariables>(
    InvitationPageQueryDocument,
    options,
  );
}
export type InvitationPageQueryHookResult = ReturnType<typeof useInvitationPageQuery>;
export type InvitationPageQueryLazyQueryHookResult = ReturnType<typeof useInvitationPageQueryLazyQuery>;
export type InvitationPageQueryQueryResult = Apollo.QueryResult<InvitationPageQueryData, InvitationPageQueryVariables>;
