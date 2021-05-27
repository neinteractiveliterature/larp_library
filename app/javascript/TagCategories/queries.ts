import { gql } from '@apollo/client';

export const TagCategoryFragment = gql`
  fragment TagCategoryFragment on TagCategory {
    id
    name
    color
    textColor
    icon
  }
`;

export const TagCategoryAutocompleteQuery = gql`
  query TagCategoryAutocompleteQuery($queryString: String) {
    tagCategories(queryString: $queryString) {
      edges {
        node {
          id
          ...TagCategoryFragment
        }
      }
    }
  }

  ${TagCategoryFragment}
`;
