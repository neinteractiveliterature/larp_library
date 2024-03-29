import { gql } from '@apollo/client';
import { ProjectHeadersFragment } from '../ProjectSearch/queries';
import { TagFragment } from '../Tags/queries';

export const HomePageQuery = gql`
  query HomePageQuery {
    projectPromotions {
      id

      project {
        ...ProjectHeadersFragment
      }
    }

    tags(first: 200) {
      edges {
        node {
          id
          ...TagFragment

          projects {
            totalCount
          }
        }
      }
    }

    tagCategories {
      edges {
        node {
          id
          name

          tags {
            id
            ...TagFragment
          }
        }
      }
    }
  }

  ${ProjectHeadersFragment}
  ${TagFragment}
`;
