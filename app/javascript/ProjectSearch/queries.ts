import { gql } from '@apollo/client';
import { TagFragment } from '../Tags/queries';

export const ProjectHeadersFragment = gql`
  fragment ProjectHeadersFragment on Project {
    id
    title
    authors
    minPlayers
    maxPlayers
    publicationYear
    lengthQuantity
    lengthUnits

    brand {
      id
      name
      slug
    }

    tags {
      id
      ...TagFragment
    }
  }

  ${TagFragment}
`;

export const ProjectSearchQuery = gql`
  query ProjectSearchQuery($queryString: String, $after: String) {
    projects(queryString: $queryString, after: $after) {
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

  ${ProjectHeadersFragment}
`;
