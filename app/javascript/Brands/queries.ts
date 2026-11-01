import { gql } from '@apollo/client';

export const BrandPageBrandFields = gql`
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

export const NewBrandQuery = gql`
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

export const BrandMembershipFields = gql`
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

export const EditBrandQuery = gql`
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

  ${BrandMembershipFields}
`;
