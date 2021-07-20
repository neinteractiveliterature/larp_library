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

export const ProjectLinkFieldsFragment = gql`
  fragment ProjectLinkFieldsFragment on ProjectLink {
    id
    url
    title
    icon
    position
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

    projectLinks {
      id
      ...ProjectLinkFieldsFragment
    }
  }

  ${ProjectHeadersFragment}
  ${LicenseFieldsFragment}
  ${ProjectFileFieldsFragment}
  ${ProjectLinkFieldsFragment}
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
