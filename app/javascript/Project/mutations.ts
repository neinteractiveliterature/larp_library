import { gql } from '@apollo/client';
import {
  ProjectFieldsFragment,
  ProjectFileFieldsFragment,
  ProjectLinkFieldsFragment,
} from './queries';

export const CreateProject = gql`
  mutation CreateProject($brandId: ID!, $projectAttributes: ProjectAttributes!) {
    createProject(input: { brandId: $brandId, projectAttributes: $projectAttributes }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }

  ${ProjectFieldsFragment}
`;

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

export const CreateProjectLink = gql`
  mutation CreateProjectLink($projectId: ID!, $projectLinkAttributes: ProjectLinkAttributes!) {
    createProjectLink(
      input: { projectId: $projectId, projectLinkAttributes: $projectLinkAttributes }
    ) {
      projectLink {
        ...ProjectLinkFieldsFragment
      }
    }
  }

  ${ProjectLinkFieldsFragment}
`;

export const UpdateProjectLink = gql`
  mutation UpdateProjectLink($id: ID!, $projectLinkAttributes: ProjectLinkAttributes!) {
    updateProjectLink(input: { id: $id, projectLinkAttributes: $projectLinkAttributes }) {
      projectLink {
        ...ProjectLinkFieldsFragment
      }
    }
  }

  ${ProjectLinkFieldsFragment}
`;

export const DeleteProjectLink = gql`
  mutation DeleteProjectLink($id: ID!) {
    deleteProjectLink(input: { id: $id }) {
      clientMutationId
    }
  }
`;
