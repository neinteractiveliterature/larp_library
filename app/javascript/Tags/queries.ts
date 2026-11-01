import { gql } from '@apollo/client';
import { TagCategoryFragment } from '../TagCategories/TagCategoryFragment';

export const TagFragment = gql`
  fragment TagFragment on Tag {
    id
    name

    tagCategory {
      id
      ...TagCategoryFragment
    }
  }

  ${TagCategoryFragment}
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
