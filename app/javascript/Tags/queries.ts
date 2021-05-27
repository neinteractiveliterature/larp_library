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

export const TagListPageQuery = gql`
  query TagListPageQuery($after: String) {
    tags(first: 25, after: $after) {
      pageInfo {
        endCursor
      }

      totalCount

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

export const EditTagQuery = gql`
  query EditTagQuery($id: ID!) {
    tag(id: $id) {
      id
      ...TagFragment

      projects {
        totalCount
      }
    }
  }

  ${TagFragment}
`;
