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
