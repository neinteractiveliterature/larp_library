import { gql } from '@apollo/client';

export const AcceptBrandMembershipInvitation = gql`
  mutation AcceptBrandMembershipInvitation($brandId: ID!, $invitationToken: String!) {
    acceptBrandMembershipInvitation(
      input: { brandId: $brandId, invitationToken: $invitationToken }
    ) {
      clientMutationId
    }
  }
`;
