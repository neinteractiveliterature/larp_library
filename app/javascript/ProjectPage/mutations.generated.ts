/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { ProjectFileFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { ProjectFileFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CompleteProjectFileUploadMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  url: Types.Scalars['String'];
  filename: Types.Scalars['String'];
  filesize: Types.Scalars['Int'];
  filetype?: Types.Maybe<Types.Scalars['String']>;
  filepath: Types.Scalars['String'];
}>;


export type CompleteProjectFileUploadMutationData = (
  { __typename: 'Mutation' }
  & { completeProjectFileUpload?: Types.Maybe<(
    { __typename: 'CompleteProjectFileUploadPayload' }
    & { projectFile: (
      { __typename: 'ProjectFile' }
      & Pick<Types.ProjectFile, 'id'>
      & ProjectFileFieldsFragment
    ) }
  )> }
);

export type DeleteProjectFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteProjectFileMutationData = (
  { __typename: 'Mutation' }
  & { deleteProjectFile?: Types.Maybe<(
    { __typename: 'DeleteProjectFilePayload' }
    & Pick<Types.DeleteProjectFilePayload, 'clientMutationId'>
  )> }
);


export const CompleteProjectFileUploadDocument = gql`
    mutation CompleteProjectFileUpload($projectId: ID!, $url: String!, $filename: String!, $filesize: Int!, $filetype: String, $filepath: String!) {
  completeProjectFileUpload(
    input: {projectId: $projectId, url: $url, filename: $filename, filesize: $filesize, filetype: $filetype, filepath: $filepath}
  ) {
    projectFile {
      id
      ...ProjectFileFieldsFragment
    }
  }
}
    ${ProjectFileFieldsFragmentDoc}`;
export type CompleteProjectFileUploadMutationFn = Apollo.MutationFunction<CompleteProjectFileUploadMutationData, CompleteProjectFileUploadMutationVariables>;

/**
 * __useCompleteProjectFileUploadMutation__
 *
 * To run a mutation, you first call `useCompleteProjectFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteProjectFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeProjectFileUploadMutation, { data, loading, error }] = useCompleteProjectFileUploadMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      url: // value for 'url'
 *      filename: // value for 'filename'
 *      filesize: // value for 'filesize'
 *      filetype: // value for 'filetype'
 *      filepath: // value for 'filepath'
 *   },
 * });
 */
export function useCompleteProjectFileUploadMutation(baseOptions?: Apollo.MutationHookOptions<CompleteProjectFileUploadMutationData, CompleteProjectFileUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteProjectFileUploadMutationData, CompleteProjectFileUploadMutationVariables>(CompleteProjectFileUploadDocument, options);
      }
export type CompleteProjectFileUploadMutationHookResult = ReturnType<typeof useCompleteProjectFileUploadMutation>;
export type CompleteProjectFileUploadMutationResult = Apollo.MutationResult<CompleteProjectFileUploadMutationData>;
export type CompleteProjectFileUploadMutationOptions = Apollo.BaseMutationOptions<CompleteProjectFileUploadMutationData, CompleteProjectFileUploadMutationVariables>;
export const DeleteProjectFileDocument = gql`
    mutation DeleteProjectFile($id: ID!) {
  deleteProjectFile(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteProjectFileMutationFn = Apollo.MutationFunction<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>;

/**
 * __useDeleteProjectFileMutation__
 *
 * To run a mutation, you first call `useDeleteProjectFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectFileMutation, { data, loading, error }] = useDeleteProjectFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>(DeleteProjectFileDocument, options);
      }
export type DeleteProjectFileMutationHookResult = ReturnType<typeof useDeleteProjectFileMutation>;
export type DeleteProjectFileMutationResult = Apollo.MutationResult<DeleteProjectFileMutationData>;
export type DeleteProjectFileMutationOptions = Apollo.BaseMutationOptions<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>;