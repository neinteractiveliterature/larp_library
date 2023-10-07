/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ProjectHeadersFragmentDoc } from '../ProjectSearch/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProjectFileFieldsFragment = {
  __typename: 'ProjectFile';
  id: string;
  url: string;
  filename: string;
  filesize: number;
  filetype?: string | null;
  position: number;
};

export type ProjectLinkFieldsFragment = {
  __typename: 'ProjectLink';
  id: string;
  url: string;
  title: string;
  icon?: string | null;
  position: number;
};

export type LicenseFieldsFragment = {
  __typename: 'License';
  id: string;
  name: string;
  url: string;
  logoUrl?: string | null;
  dedicationHtml?: string | null;
  discouraged: boolean;
  discouragedReason?: string | null;
};

export type NewProjectFormQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type NewProjectFormQueryData = {
  __typename: 'Query';
  brand: { __typename: 'Brand'; id: string };
  licenses: Array<{
    __typename: 'License';
    id: string;
    name: string;
    url: string;
    logoUrl?: string | null;
    dedicationHtml?: string | null;
    discouraged: boolean;
    discouragedReason?: string | null;
  }>;
};

export type ProjectFieldsFragment = {
  __typename: 'Project';
  id: string;
  description?: string | null;
  currentUserCanEdit: boolean;
  currentUserCanDelete: boolean;
  currentUserCanUploadFiles: boolean;
  currentUserCanDeleteFiles: boolean;
  title?: string | null;
  authors?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minFacilitators?: number | null;
  maxFacilitators?: number | null;
  publicationYear?: number | null;
  lengthQuantity?: number | null;
  lengthUnits?: string | null;
  license?: {
    __typename: 'License';
    id: string;
    name: string;
    url: string;
    logoUrl?: string | null;
    dedicationHtml?: string | null;
    discouraged: boolean;
    discouragedReason?: string | null;
  } | null;
  projectFiles: Array<{
    __typename: 'ProjectFile';
    id: string;
    url: string;
    filename: string;
    filesize: number;
    filetype?: string | null;
    position: number;
  }>;
  projectLinks: Array<{
    __typename: 'ProjectLink';
    id: string;
    url: string;
    title: string;
    icon?: string | null;
    position: number;
  }>;
  brand: { __typename: 'Brand'; id: string; name: string; slug: string };
  tags: Array<{
    __typename: 'Tag';
    id: string;
    name: string;
    tagCategory?: {
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: string | null;
      textColor?: string | null;
      icon?: string | null;
    } | null;
  }>;
};

export type ProjectPageQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID']['input'];
}>;

export type ProjectPageQueryData = {
  __typename: 'Query';
  project: {
    __typename: 'Project';
    id: string;
    description?: string | null;
    currentUserCanEdit: boolean;
    currentUserCanDelete: boolean;
    currentUserCanUploadFiles: boolean;
    currentUserCanDeleteFiles: boolean;
    title?: string | null;
    authors?: string | null;
    minPlayers?: number | null;
    maxPlayers?: number | null;
    minFacilitators?: number | null;
    maxFacilitators?: number | null;
    publicationYear?: number | null;
    lengthQuantity?: number | null;
    lengthUnits?: string | null;
    license?: {
      __typename: 'License';
      id: string;
      name: string;
      url: string;
      logoUrl?: string | null;
      dedicationHtml?: string | null;
      discouraged: boolean;
      discouragedReason?: string | null;
    } | null;
    projectFiles: Array<{
      __typename: 'ProjectFile';
      id: string;
      url: string;
      filename: string;
      filesize: number;
      filetype?: string | null;
      position: number;
    }>;
    projectLinks: Array<{
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: string | null;
      position: number;
    }>;
    brand: { __typename: 'Brand'; id: string; name: string; slug: string };
    tags: Array<{
      __typename: 'Tag';
      id: string;
      name: string;
      tagCategory?: {
        __typename: 'TagCategory';
        id: string;
        name: string;
        color?: string | null;
        textColor?: string | null;
        icon?: string | null;
      } | null;
    }>;
  };
  licenses: Array<{
    __typename: 'License';
    id: string;
    name: string;
    url: string;
    logoUrl?: string | null;
    dedicationHtml?: string | null;
    discouraged: boolean;
    discouragedReason?: string | null;
  }>;
};

export type SignRequestQueryVariables = Types.Exact<{
  httpMethod: Types.Scalars['String']['input'];
  url: Types.Scalars['String']['input'];
  headers: Types.Scalars['JSON']['input'];
}>;

export type SignRequestQueryData = { __typename: 'Query'; presignS3Url: string };

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
    position
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
  return Apollo.useQuery<NewProjectFormQueryData, NewProjectFormQueryVariables>(NewProjectFormQueryDocument, options);
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
export type NewProjectFormQueryLazyQueryHookResult = ReturnType<typeof useNewProjectFormQueryLazyQuery>;
export type NewProjectFormQueryQueryResult = Apollo.QueryResult<NewProjectFormQueryData, NewProjectFormQueryVariables>;
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
  return Apollo.useQuery<ProjectPageQueryData, ProjectPageQueryVariables>(ProjectPageQueryDocument, options);
}
export function useProjectPageQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectPageQueryData, ProjectPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectPageQueryData, ProjectPageQueryVariables>(ProjectPageQueryDocument, options);
}
export type ProjectPageQueryHookResult = ReturnType<typeof useProjectPageQuery>;
export type ProjectPageQueryLazyQueryHookResult = ReturnType<typeof useProjectPageQueryLazyQuery>;
export type ProjectPageQueryQueryResult = Apollo.QueryResult<ProjectPageQueryData, ProjectPageQueryVariables>;
export const SignRequestQueryDocument = gql`
  query SignRequestQuery($httpMethod: String!, $url: String!, $headers: JSON!) {
    presignS3Url(httpMethod: $httpMethod, url: $url, headers: $headers)
  }
`;

/**
 * __useSignRequestQuery__
 *
 * To run a query within a React component, call `useSignRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignRequestQuery({
 *   variables: {
 *      httpMethod: // value for 'httpMethod'
 *      url: // value for 'url'
 *      headers: // value for 'headers'
 *   },
 * });
 */
export function useSignRequestQuery(
  baseOptions: Apollo.QueryHookOptions<SignRequestQueryData, SignRequestQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SignRequestQueryData, SignRequestQueryVariables>(SignRequestQueryDocument, options);
}
export function useSignRequestQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SignRequestQueryData, SignRequestQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SignRequestQueryData, SignRequestQueryVariables>(SignRequestQueryDocument, options);
}
export type SignRequestQueryHookResult = ReturnType<typeof useSignRequestQuery>;
export type SignRequestQueryLazyQueryHookResult = ReturnType<typeof useSignRequestQueryLazyQuery>;
export type SignRequestQueryQueryResult = Apollo.QueryResult<SignRequestQueryData, SignRequestQueryVariables>;
