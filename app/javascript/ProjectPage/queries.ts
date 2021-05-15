import { gql } from '@apollo/client';

export const ProjectFileFieldsFragment = gql`
  fragment ProjectFileFieldsFragment on ProjectFile {
    id
    url
    filename
    filesize
    filetype
  }
`;

export const ProjectFilesQuery = gql`
  query ProjectFilesQuery($projectId: ID!) {
    project(id: $projectId) {
      id
      projectFiles {
        id
        ...ProjectFileFieldsFragment
      }
    }
  }

  ${ProjectFileFieldsFragment}
`;
