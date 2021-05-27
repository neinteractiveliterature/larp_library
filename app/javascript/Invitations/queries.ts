import { gql } from '@apollo/client';

export const InvitationPageQuery = gql`
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
