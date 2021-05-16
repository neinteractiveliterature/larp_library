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

    tags {
      nodes {
        id
        ...TagFragment

        projects {
          totalCount
        }
      }
    }

    tagCategories {
      nodes {
        id
        name
      }
    }
  }

  ${ProjectHeadersFragment}
  ${TagFragment}
`;
