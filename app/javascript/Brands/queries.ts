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

export const BrandPageQuery = gql`
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

  ${ProjectHeadersFragment}
`;
