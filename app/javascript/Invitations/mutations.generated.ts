/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AcceptBrandMembershipInvitationMutationVariables = Types.Exact<{
  brandId: Types.Scalars['ID']['input'];
  invitationToken: Types.Scalars['String']['input'];
}>;

export type AcceptBrandMembershipInvitationMutationData = {
  __typename: 'Mutation';
  acceptBrandMembershipInvitation?: {
    __typename: 'AcceptBrandMembershipInvitationPayload';
    clientMutationId?: string | null;
  } | null;
};

export const AcceptBrandMembershipInvitationDocument = gql`
  mutation AcceptBrandMembershipInvitation($brandId: ID!, $invitationToken: String!) {
    acceptBrandMembershipInvitation(input: { brandId: $brandId, invitationToken: $invitationToken }) {
      clientMutationId
    }
  }
`;
export type AcceptBrandMembershipInvitationMutationFn = Apollo.MutationFunction<
  AcceptBrandMembershipInvitationMutationData,
  AcceptBrandMembershipInvitationMutationVariables
>;

/**
 * __useAcceptBrandMembershipInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptBrandMembershipInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptBrandMembershipInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptBrandMembershipInvitationMutation, { data, loading, error }] = useAcceptBrandMembershipInvitationMutation({
 *   variables: {
 *      brandId: // value for 'brandId'
 *      invitationToken: // value for 'invitationToken'
 *   },
 * });
 */
export function useAcceptBrandMembershipInvitationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AcceptBrandMembershipInvitationMutationData,
    AcceptBrandMembershipInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AcceptBrandMembershipInvitationMutationData,
    AcceptBrandMembershipInvitationMutationVariables
  >(AcceptBrandMembershipInvitationDocument, options);
}
export type AcceptBrandMembershipInvitationMutationHookResult = ReturnType<
  typeof useAcceptBrandMembershipInvitationMutation
>;
export type AcceptBrandMembershipInvitationMutationResult =
  Apollo.MutationResult<AcceptBrandMembershipInvitationMutationData>;
export type AcceptBrandMembershipInvitationMutationOptions = Apollo.BaseMutationOptions<
  AcceptBrandMembershipInvitationMutationData,
  AcceptBrandMembershipInvitationMutationVariables
>;
