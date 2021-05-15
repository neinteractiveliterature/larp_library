import { gql } from '@apollo/client';
import { ProjectFileFieldsFragment } from './queries';

export const CompleteProjectFileUpload = gql`
  mutation CompleteProjectFileUpload(
    $projectId: ID!
    $url: String!
    $filename: String!
    $filesize: Int!
    $filetype: String
    $filepath: String!
  ) {
    completeProjectFileUpload(
      input: {
        projectId: $projectId
        url: $url
        filename: $filename
        filesize: $filesize
        filetype: $filetype
        filepath: $filepath
      }
    ) {
      projectFile {
        id
        ...ProjectFileFieldsFragment
      }
    }
  }

  ${ProjectFileFieldsFragment}
`;

export const DeleteProjectFile = gql`
  mutation DeleteProjectFile($id: ID!) {
    deleteProjectFile(input: { id: $id }) {
      clientMutationId
    }
  }
`;
