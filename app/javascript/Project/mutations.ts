import { gql } from '@apollo/client';
import { ProjectFieldsFragment, ProjectFileFieldsFragment } from './queries';

export const UpdateProject = gql`
  mutation UpdateProject($id: ID!, $projectAttributes: ProjectAttributes!) {
    updateProject(input: { id: $id, projectAttributes: $projectAttributes }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }

  ${ProjectFieldsFragment}
`;

export const DeleteProject = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(input: { id: $id }) {
      clientMutationId
    }
  }
`;

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
