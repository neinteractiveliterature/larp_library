import { gql } from '@apollo/client';
import { TagFragment } from './queries';

export const CreateTag = gql`
  mutation CreateTag($tagAttributes: TagAttributes!) {
    createTag(input: { tagAttributes: $tagAttributes }) {
      tag {
        ...TagFragment
      }
    }
  }

  ${TagFragment}
`;

export const UpdateTag = gql`
  mutation UpdateTag($id: ID!, $tagAttributes: TagAttributes!) {
    updateTag(input: { id: $id, tagAttributes: $tagAttributes }) {
      tag {
        ...TagFragment
      }
    }
  }

  ${TagFragment}
`;

export const DeleteTag = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(input: { id: $id }) {
      clientMutationId
    }
  }
`;
