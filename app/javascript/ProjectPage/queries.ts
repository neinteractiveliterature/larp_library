import { gql } from '@apollo/client';
import { ProjectHeadersFragment } from '../ProjectSearch/queries';

export const ProjectFileFieldsFragment = gql`
  fragment ProjectFileFieldsFragment on ProjectFile {
    id
    url
    filename
    filesize
    filetype
  }
`;

export const ProjectPageQuery = gql`
  query ProjectPageQuery($projectId: ID!) {
    project(id: $projectId) {
      id
      description
      currentUserCanEdit
      currentUserCanDelete
      currentUserCanUploadFiles
      currentUserCanDeleteFiles

      ...ProjectHeadersFragment

      license {
        id
        name
        url
        logoUrl
        dedicationHtml
      }

      projectFiles {
        id
        ...ProjectFileFieldsFragment
      }
    }
  }

  ${ProjectHeadersFragment}
  ${ProjectFileFieldsFragment}
`;
