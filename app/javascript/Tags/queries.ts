import { gql } from '@apollo/client';

export const TagFragment = gql`
  fragment TagFragment on Tag {
    id
    name

    tagCategory {
      id
      name
      color
      textColor
      icon
    }
  }
`;

export const TagAutocompleteQuery = gql`
  query TagAutocompleteQuery($queryString: String) {
    tags(queryString: $queryString) {
      edges {
        node {
          id
          ...TagFragment
        }
      }
    }
  }

  ${TagFragment}
`;
