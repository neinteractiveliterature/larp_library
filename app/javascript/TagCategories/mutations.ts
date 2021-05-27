import { gql } from '@apollo/client';
import { TagCategoryFragment } from './TagCategoryFragment';

export const CreateTagCategory = gql`
  mutation CreateTagCategory($tagCategoryAttributes: TagCategoryAttributes!) {
    createTagCategory(input: { tagCategoryAttributes: $tagCategoryAttributes }) {
      tagCategory {
        ...TagCategoryFragment
      }
    }
  }

  ${TagCategoryFragment}
`;

export const UpdateTagCategory = gql`
  mutation UpdateTagCategory($id: ID!, $tagCategoryAttributes: TagCategoryAttributes!) {
    updateTagCategory(input: { id: $id, tagCategoryAttributes: $tagCategoryAttributes }) {
      tagCategory {
        ...TagCategoryFragment
      }
    }
  }

  ${TagCategoryFragment}
`;

export const DeleteTagCategory = gql`
  mutation DeleteTagCategory($id: ID!) {
    deleteTagCategory(input: { id: $id }) {
      clientMutationId
    }
  }
`;
