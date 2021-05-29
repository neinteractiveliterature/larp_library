import { gql } from '@apollo/client';
import { TagFragment } from '../Tags/queries';

export const ProjectHeadersFragment = gql`
  fragment ProjectHeadersFragment on Project {
    id
    title
    authors
    minPlayers
    maxPlayers
    minFacilitators
    maxFacilitators
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
  query ProjectSearchQuery(
    $queryString: String
    $tag: String
    $title: String
    $authors: String
    $playerCountUpperBound: Int
    $playerCountLowerBound: Int
    $facilitatorCountUpperBound: Int
    $facilitatorCountLowerBound: Int
    $after: String
  ) {
    projects(
      queryString: $queryString
      tag: $tag
      title: $title
      authors: $authors
      playerCountUpperBound: $playerCountUpperBound
      playerCountLowerBound: $playerCountLowerBound
      facilitatorCountUpperBound: $facilitatorCountUpperBound
      facilitatorCountLowerBound: $facilitatorCountLowerBound
      after: $after
    ) {
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

    tagByName(name: $tag) {
      id
      ...TagFragment
    }
  }

  ${ProjectHeadersFragment}
  ${TagFragment}
`;
