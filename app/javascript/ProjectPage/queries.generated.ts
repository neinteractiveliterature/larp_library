/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type ProjectFileFieldsFragment = { __typename: 'ProjectFile' } & Pick<
  Types.ProjectFile,
  'id' | 'url' | 'filename' | 'filesize' | 'filetype'
>;

export type ProjectFilesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
}>;

export type ProjectFilesQueryData = { __typename: 'Query' } & {
  project: { __typename: 'Project' } & Pick<Types.Project, 'id'> & {
      projectFiles: Array<
        { __typename: 'ProjectFile' } & Pick<Types.ProjectFile, 'id'> & ProjectFileFieldsFragment
      >;
    };
};

export const ProjectFileFieldsFragmentDoc = gql`
  fragment ProjectFileFieldsFragment on ProjectFile {
    id
    url
    filename
    filesize
    filetype
  }
`;
export const ProjectFilesQueryDocument = gql`
  query ProjectFilesQuery($projectId: ID!) {
    project(id: $projectId) {
      id
      projectFiles {
        id
        ...ProjectFileFieldsFragment
      }
    }
  }
  ${ProjectFileFieldsFragmentDoc}
`;

/**
 * __useProjectFilesQuery__
 *
 * To run a query within a React component, call `useProjectFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectFilesQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectFilesQuery(
  baseOptions: Apollo.QueryHookOptions<ProjectFilesQueryData, ProjectFilesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProjectFilesQueryData, ProjectFilesQueryVariables>(
    ProjectFilesQueryDocument,
    options,
  );
}
export function useProjectFilesQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectFilesQueryData, ProjectFilesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectFilesQueryData, ProjectFilesQueryVariables>(
    ProjectFilesQueryDocument,
    options,
  );
}
export type ProjectFilesQueryHookResult = ReturnType<typeof useProjectFilesQuery>;
export type ProjectFilesQueryLazyQueryHookResult = ReturnType<typeof useProjectFilesQueryLazyQuery>;
export type ProjectFilesQueryQueryResult = Apollo.QueryResult<
  ProjectFilesQueryData,
  ProjectFilesQueryVariables
>;
