import { gql } from '@apollo/client';
import { TagFragment } from '../Tags/queries';
import { TagCategoryFragment } from './TagCategoryFragment';

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

export const TagCategoryListPageQuery = gql`
  query TagCategoryListPageQuery($after: String) {
    tagCategories(first: 25, after: $after) {
      pageInfo {
        endCursor
      }

      totalCount

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

export const EditTagCategoryQuery = gql`
  query EditTagCategoryQuery($id: ID!) {
    tagCategory(id: $id) {
      id
      ...TagCategoryFragment

      tags {
        ...TagFragment
      }
    }
  }

  ${TagCategoryFragment}
  ${TagFragment}
`;
