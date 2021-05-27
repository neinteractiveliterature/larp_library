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

export const LicenseFieldsFragment = gql`
  fragment LicenseFieldsFragment on License {
    id
    name
    url
    logoUrl
    dedicationHtml
    discouraged
    discouragedReason
  }
`;

export const NewProjectFormQuery = gql`
  query NewProjectFormQuery($slug: String!) {
    brand(slug: $slug) {
      id
    }

    licenses {
      ...LicenseFieldsFragment
    }

    ${LicenseFieldsFragment}
  }
`;

export const ProjectFieldsFragment = gql`
  fragment ProjectFieldsFragment on Project {
    id
    description
    currentUserCanEdit
    currentUserCanDelete
    currentUserCanUploadFiles
    currentUserCanDeleteFiles

    ...ProjectHeadersFragment

    license {
      id
      ...LicenseFieldsFragment
    }

    projectFiles {
      id
      ...ProjectFileFieldsFragment
    }
  }

  ${ProjectHeadersFragment}
  ${LicenseFieldsFragment}
  ${ProjectFileFieldsFragment}
`;

export const ProjectPageQuery = gql`
  query ProjectPageQuery($projectId: ID!) {
    project(id: $projectId) {
      ...ProjectFieldsFragment
    }

    licenses {
      id
      ...LicenseFieldsFragment
    }
  }

  ${ProjectFieldsFragment}
  ${LicenseFieldsFragment}
`;
