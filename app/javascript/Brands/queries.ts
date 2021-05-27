import { gql } from '@apollo/client';
import { ProjectHeadersFragment } from '../ProjectSearch/queries';

export const BrandsPageQuery = gql`
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

export const BrandPageQuery = gql`
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

  ${BrandPageBrandFields}
  ${ProjectHeadersFragment}
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

export const UnapprovedBrandsListPageQuery = gql`
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
