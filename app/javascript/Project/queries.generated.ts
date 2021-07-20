/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { ProjectHeadersFragment } from '../ProjectSearch/queries.generated';
import { gql } from '@apollo/client';
import { ProjectHeadersFragmentDoc } from '../ProjectSearch/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type ProjectFileFieldsFragment = { __typename: 'ProjectFile' } & Pick<
  Types.ProjectFile,
  'id' | 'url' | 'filename' | 'filesize' | 'filetype'
>;

export type ProjectLinkFieldsFragment = { __typename: 'ProjectLink' } & Pick<
  Types.ProjectLink,
  'id' | 'url' | 'title' | 'icon' | 'position'
>;

export type LicenseFieldsFragment = { __typename: 'License' } & Pick<
  Types.License,
  'id' | 'name' | 'url' | 'logoUrl' | 'dedicationHtml' | 'discouraged' | 'discouragedReason'
>;

export type NewProjectFormQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;

export type NewProjectFormQueryData = { __typename: 'Query' } & {
  brand: { __typename: 'Brand' } & Pick<Types.Brand, 'id'>;
  licenses: Array<{ __typename: 'License' } & LicenseFieldsFragment>;
};

export type ProjectFieldsFragment = { __typename: 'Project' } & Pick<
  Types.Project,
  | 'id'
  | 'description'
  | 'currentUserCanEdit'
  | 'currentUserCanDelete'
  | 'currentUserCanUploadFiles'
  | 'currentUserCanDeleteFiles'
> & {
    license?: Types.Maybe<
      { __typename: 'License' } & Pick<Types.License, 'id'> & LicenseFieldsFragment
    >;
    projectFiles: Array<
      { __typename: 'ProjectFile' } & Pick<Types.ProjectFile, 'id'> & ProjectFileFieldsFragment
    >;
    projectLinks: Array<
      { __typename: 'ProjectLink' } & Pick<Types.ProjectLink, 'id'> & ProjectLinkFieldsFragment
    >;
  } & ProjectHeadersFragment;

export type ProjectPageQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
}>;

export type ProjectPageQueryData = { __typename: 'Query' } & {
  project: { __typename: 'Project' } & ProjectFieldsFragment;
  licenses: Array<{ __typename: 'License' } & Pick<Types.License, 'id'> & LicenseFieldsFragment>;
};

export const LicenseFieldsFragmentDoc = gql`
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
export const ProjectFileFieldsFragmentDoc = gql`
  fragment ProjectFileFieldsFragment on ProjectFile {
    id
    url
    filename
    filesize
    filetype
  }
`;
export const ProjectLinkFieldsFragmentDoc = gql`
  fragment ProjectLinkFieldsFragment on ProjectLink {
    id
    url
    title
    icon
    position
  }
`;
export const ProjectFieldsFragmentDoc = gql`
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
  ${ProjectHeadersFragmentDoc}
  ${LicenseFieldsFragmentDoc}
  ${ProjectFileFieldsFragmentDoc}
  ${ProjectLinkFieldsFragmentDoc}
`;
export const NewProjectFormQueryDocument = gql`
  query NewProjectFormQuery($slug: String!) {
    brand(slug: $slug) {
      id
    }
    licenses {
      ...LicenseFieldsFragment
    }
  }
  ${LicenseFieldsFragmentDoc}
`;

/**
 * __useNewProjectFormQuery__
 *
 * To run a query within a React component, call `useNewProjectFormQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewProjectFormQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewProjectFormQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useNewProjectFormQuery(
  baseOptions: Apollo.QueryHookOptions<NewProjectFormQueryData, NewProjectFormQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NewProjectFormQueryData, NewProjectFormQueryVariables>(
    NewProjectFormQueryDocument,
    options,
  );
}
export function useNewProjectFormQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NewProjectFormQueryData, NewProjectFormQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NewProjectFormQueryData, NewProjectFormQueryVariables>(
    NewProjectFormQueryDocument,
    options,
  );
}
export type NewProjectFormQueryHookResult = ReturnType<typeof useNewProjectFormQuery>;
export type NewProjectFormQueryLazyQueryHookResult = ReturnType<
  typeof useNewProjectFormQueryLazyQuery
>;
export type NewProjectFormQueryQueryResult = Apollo.QueryResult<
  NewProjectFormQueryData,
  NewProjectFormQueryVariables
>;
export const ProjectPageQueryDocument = gql`
  query ProjectPageQuery($projectId: ID!) {
    project(id: $projectId) {
      ...ProjectFieldsFragment
    }
    licenses {
      id
      ...LicenseFieldsFragment
    }
  }
  ${ProjectFieldsFragmentDoc}
  ${LicenseFieldsFragmentDoc}
`;

/**
 * __useProjectPageQuery__
 *
 * To run a query within a React component, call `useProjectPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectPageQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectPageQuery(
  baseOptions: Apollo.QueryHookOptions<ProjectPageQueryData, ProjectPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProjectPageQueryData, ProjectPageQueryVariables>(
    ProjectPageQueryDocument,
    options,
  );
}
export function useProjectPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectPageQueryData, ProjectPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectPageQueryData, ProjectPageQueryVariables>(
    ProjectPageQueryDocument,
    options,
  );
}
export type ProjectPageQueryHookResult = ReturnType<typeof useProjectPageQuery>;
export type ProjectPageQueryLazyQueryHookResult = ReturnType<typeof useProjectPageQueryLazyQuery>;
export type ProjectPageQueryQueryResult = Apollo.QueryResult<
  ProjectPageQueryData,
  ProjectPageQueryVariables
>;
