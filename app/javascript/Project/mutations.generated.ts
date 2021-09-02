/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import {
  ProjectFieldsFragmentDoc,
  LicenseFieldsFragmentDoc,
  ProjectFileFieldsFragmentDoc,
  ProjectLinkFieldsFragmentDoc,
} from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type CreateProjectMutationVariables = Types.Exact<{
  brandId: Types.Scalars['ID'];
  projectAttributes: Types.ProjectAttributes;
}>;

export type CreateProjectMutationData = {
  __typename: 'Mutation';
  createProject?: Types.Maybe<{
    __typename: 'CreateProjectPayload';
    project: {
      __typename: 'Project';
      id: string;
      description?: Types.Maybe<string>;
      currentUserCanEdit: boolean;
      currentUserCanDelete: boolean;
      currentUserCanUploadFiles: boolean;
      currentUserCanDeleteFiles: boolean;
      title?: Types.Maybe<string>;
      authors?: Types.Maybe<string>;
      minPlayers?: Types.Maybe<number>;
      maxPlayers?: Types.Maybe<number>;
      minFacilitators?: Types.Maybe<number>;
      maxFacilitators?: Types.Maybe<number>;
      publicationYear?: Types.Maybe<number>;
      lengthQuantity?: Types.Maybe<number>;
      lengthUnits?: Types.Maybe<string>;
      license?: Types.Maybe<{
        __typename: 'License';
        id: string;
        name: string;
        url: string;
        logoUrl?: Types.Maybe<string>;
        dedicationHtml?: Types.Maybe<string>;
        discouraged: boolean;
        discouragedReason?: Types.Maybe<string>;
      }>;
      projectFiles: Array<{
        __typename: 'ProjectFile';
        id: string;
        url: string;
        filename: string;
        filesize: number;
        filetype?: Types.Maybe<string>;
        position: number;
      }>;
      projectLinks: Array<{
        __typename: 'ProjectLink';
        id: string;
        url: string;
        title: string;
        icon?: Types.Maybe<string>;
        position: number;
      }>;
      brand: { __typename: 'Brand'; id: string; name: string; slug: string };
      tags: Array<{
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: Types.Maybe<{
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: Types.Maybe<string>;
          textColor?: Types.Maybe<string>;
          icon?: Types.Maybe<string>;
        }>;
      }>;
    };
  }>;
};

export type UpdateProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  projectAttributes: Types.ProjectAttributes;
}>;

export type UpdateProjectMutationData = {
  __typename: 'Mutation';
  updateProject?: Types.Maybe<{
    __typename: 'UpdateProjectPayload';
    project: {
      __typename: 'Project';
      id: string;
      description?: Types.Maybe<string>;
      currentUserCanEdit: boolean;
      currentUserCanDelete: boolean;
      currentUserCanUploadFiles: boolean;
      currentUserCanDeleteFiles: boolean;
      title?: Types.Maybe<string>;
      authors?: Types.Maybe<string>;
      minPlayers?: Types.Maybe<number>;
      maxPlayers?: Types.Maybe<number>;
      minFacilitators?: Types.Maybe<number>;
      maxFacilitators?: Types.Maybe<number>;
      publicationYear?: Types.Maybe<number>;
      lengthQuantity?: Types.Maybe<number>;
      lengthUnits?: Types.Maybe<string>;
      license?: Types.Maybe<{
        __typename: 'License';
        id: string;
        name: string;
        url: string;
        logoUrl?: Types.Maybe<string>;
        dedicationHtml?: Types.Maybe<string>;
        discouraged: boolean;
        discouragedReason?: Types.Maybe<string>;
      }>;
      projectFiles: Array<{
        __typename: 'ProjectFile';
        id: string;
        url: string;
        filename: string;
        filesize: number;
        filetype?: Types.Maybe<string>;
        position: number;
      }>;
      projectLinks: Array<{
        __typename: 'ProjectLink';
        id: string;
        url: string;
        title: string;
        icon?: Types.Maybe<string>;
        position: number;
      }>;
      brand: { __typename: 'Brand'; id: string; name: string; slug: string };
      tags: Array<{
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: Types.Maybe<{
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: Types.Maybe<string>;
          textColor?: Types.Maybe<string>;
          icon?: Types.Maybe<string>;
        }>;
      }>;
    };
  }>;
};

export type DeleteProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeleteProjectMutationData = {
  __typename: 'Mutation';
  deleteProject?: Types.Maybe<{
    __typename: 'DeleteProjectPayload';
    clientMutationId?: Types.Maybe<string>;
  }>;
};

export type CompleteProjectFileUploadMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  url: Types.Scalars['String'];
  filename: Types.Scalars['String'];
  filesize: Types.Scalars['Int'];
  filetype?: Types.Maybe<Types.Scalars['String']>;
  filepath: Types.Scalars['String'];
}>;

export type CompleteProjectFileUploadMutationData = {
  __typename: 'Mutation';
  completeProjectFileUpload?: Types.Maybe<{
    __typename: 'CompleteProjectFileUploadPayload';
    projectFile: {
      __typename: 'ProjectFile';
      id: string;
      url: string;
      filename: string;
      filesize: number;
      filetype?: Types.Maybe<string>;
      position: number;
    };
  }>;
};

export type MoveProjectFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  destinationIndex: Types.Scalars['Int'];
}>;

export type MoveProjectFileMutationData = {
  __typename: 'Mutation';
  moveProjectFile?: Types.Maybe<{
    __typename: 'MoveProjectFilePayload';
    project: {
      __typename: 'Project';
      id: string;
      description?: Types.Maybe<string>;
      currentUserCanEdit: boolean;
      currentUserCanDelete: boolean;
      currentUserCanUploadFiles: boolean;
      currentUserCanDeleteFiles: boolean;
      title?: Types.Maybe<string>;
      authors?: Types.Maybe<string>;
      minPlayers?: Types.Maybe<number>;
      maxPlayers?: Types.Maybe<number>;
      minFacilitators?: Types.Maybe<number>;
      maxFacilitators?: Types.Maybe<number>;
      publicationYear?: Types.Maybe<number>;
      lengthQuantity?: Types.Maybe<number>;
      lengthUnits?: Types.Maybe<string>;
      license?: Types.Maybe<{
        __typename: 'License';
        id: string;
        name: string;
        url: string;
        logoUrl?: Types.Maybe<string>;
        dedicationHtml?: Types.Maybe<string>;
        discouraged: boolean;
        discouragedReason?: Types.Maybe<string>;
      }>;
      projectFiles: Array<{
        __typename: 'ProjectFile';
        id: string;
        url: string;
        filename: string;
        filesize: number;
        filetype?: Types.Maybe<string>;
        position: number;
      }>;
      projectLinks: Array<{
        __typename: 'ProjectLink';
        id: string;
        url: string;
        title: string;
        icon?: Types.Maybe<string>;
        position: number;
      }>;
      brand: { __typename: 'Brand'; id: string; name: string; slug: string };
      tags: Array<{
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: Types.Maybe<{
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: Types.Maybe<string>;
          textColor?: Types.Maybe<string>;
          icon?: Types.Maybe<string>;
        }>;
      }>;
    };
  }>;
};

export type DeleteProjectFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeleteProjectFileMutationData = {
  __typename: 'Mutation';
  deleteProjectFile?: Types.Maybe<{
    __typename: 'DeleteProjectFilePayload';
    clientMutationId?: Types.Maybe<string>;
  }>;
};

export type CreateProjectLinkMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  projectLinkAttributes: Types.ProjectLinkAttributes;
}>;

export type CreateProjectLinkMutationData = {
  __typename: 'Mutation';
  createProjectLink?: Types.Maybe<{
    __typename: 'CreateProjectLinkPayload';
    projectLink: {
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: Types.Maybe<string>;
      position: number;
    };
  }>;
};

export type UpdateProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  projectLinkAttributes: Types.ProjectLinkAttributes;
}>;

export type UpdateProjectLinkMutationData = {
  __typename: 'Mutation';
  updateProjectLink?: Types.Maybe<{
    __typename: 'UpdateProjectLinkPayload';
    projectLink: {
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: Types.Maybe<string>;
      position: number;
    };
  }>;
};

export type MoveProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  destinationIndex: Types.Scalars['Int'];
}>;

export type MoveProjectLinkMutationData = {
  __typename: 'Mutation';
  moveProjectLink?: Types.Maybe<{
    __typename: 'MoveProjectLinkPayload';
    project: {
      __typename: 'Project';
      id: string;
      description?: Types.Maybe<string>;
      currentUserCanEdit: boolean;
      currentUserCanDelete: boolean;
      currentUserCanUploadFiles: boolean;
      currentUserCanDeleteFiles: boolean;
      title?: Types.Maybe<string>;
      authors?: Types.Maybe<string>;
      minPlayers?: Types.Maybe<number>;
      maxPlayers?: Types.Maybe<number>;
      minFacilitators?: Types.Maybe<number>;
      maxFacilitators?: Types.Maybe<number>;
      publicationYear?: Types.Maybe<number>;
      lengthQuantity?: Types.Maybe<number>;
      lengthUnits?: Types.Maybe<string>;
      license?: Types.Maybe<{
        __typename: 'License';
        id: string;
        name: string;
        url: string;
        logoUrl?: Types.Maybe<string>;
        dedicationHtml?: Types.Maybe<string>;
        discouraged: boolean;
        discouragedReason?: Types.Maybe<string>;
      }>;
      projectFiles: Array<{
        __typename: 'ProjectFile';
        id: string;
        url: string;
        filename: string;
        filesize: number;
        filetype?: Types.Maybe<string>;
        position: number;
      }>;
      projectLinks: Array<{
        __typename: 'ProjectLink';
        id: string;
        url: string;
        title: string;
        icon?: Types.Maybe<string>;
        position: number;
      }>;
      brand: { __typename: 'Brand'; id: string; name: string; slug: string };
      tags: Array<{
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: Types.Maybe<{
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: Types.Maybe<string>;
          textColor?: Types.Maybe<string>;
          icon?: Types.Maybe<string>;
        }>;
      }>;
    };
  }>;
};

export type DeleteProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeleteProjectLinkMutationData = {
  __typename: 'Mutation';
  deleteProjectLink?: Types.Maybe<{
    __typename: 'DeleteProjectLinkPayload';
    clientMutationId?: Types.Maybe<string>;
  }>;
};

export const CreateProjectDocument = gql`
  mutation CreateProject($brandId: ID!, $projectAttributes: ProjectAttributes!) {
    createProject(input: { brandId: $brandId, projectAttributes: $projectAttributes }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }
  ${ProjectFieldsFragmentDoc}
`;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  CreateProjectMutationData,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      brandId: // value for 'brandId'
 *      projectAttributes: // value for 'projectAttributes'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProjectMutationData,
    CreateProjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateProjectMutationData, CreateProjectMutationVariables>(
    CreateProjectDocument,
    options,
  );
}
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutationData>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMutationData,
  CreateProjectMutationVariables
>;
export const UpdateProjectDocument = gql`
  mutation UpdateProject($id: ID!, $projectAttributes: ProjectAttributes!) {
    updateProject(input: { id: $id, projectAttributes: $projectAttributes }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }
  ${ProjectFieldsFragmentDoc}
`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<
  UpdateProjectMutationData,
  UpdateProjectMutationVariables
>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectAttributes: // value for 'projectAttributes'
 *   },
 * });
 */
export function useUpdateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProjectMutationData,
    UpdateProjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectMutationData, UpdateProjectMutationVariables>(
    UpdateProjectDocument,
    options,
  );
}
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutationData>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<
  UpdateProjectMutationData,
  UpdateProjectMutationVariables
>;
export const DeleteProjectDocument = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteProjectMutationFn = Apollo.MutationFunction<
  DeleteProjectMutationData,
  DeleteProjectMutationVariables
>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProjectMutationData,
    DeleteProjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteProjectMutationData, DeleteProjectMutationVariables>(
    DeleteProjectDocument,
    options,
  );
}
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutationData>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectMutationData,
  DeleteProjectMutationVariables
>;
export const CompleteProjectFileUploadDocument = gql`
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
  ${ProjectFileFieldsFragmentDoc}
`;
export type CompleteProjectFileUploadMutationFn = Apollo.MutationFunction<
  CompleteProjectFileUploadMutationData,
  CompleteProjectFileUploadMutationVariables
>;

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
export function useCompleteProjectFileUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CompleteProjectFileUploadMutationData,
    CompleteProjectFileUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CompleteProjectFileUploadMutationData,
    CompleteProjectFileUploadMutationVariables
  >(CompleteProjectFileUploadDocument, options);
}
export type CompleteProjectFileUploadMutationHookResult = ReturnType<
  typeof useCompleteProjectFileUploadMutation
>;
export type CompleteProjectFileUploadMutationResult =
  Apollo.MutationResult<CompleteProjectFileUploadMutationData>;
export type CompleteProjectFileUploadMutationOptions = Apollo.BaseMutationOptions<
  CompleteProjectFileUploadMutationData,
  CompleteProjectFileUploadMutationVariables
>;
export const MoveProjectFileDocument = gql`
  mutation MoveProjectFile($id: ID!, $destinationIndex: Int!) {
    moveProjectFile(input: { id: $id, destinationIndex: $destinationIndex }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }
  ${ProjectFieldsFragmentDoc}
`;
export type MoveProjectFileMutationFn = Apollo.MutationFunction<
  MoveProjectFileMutationData,
  MoveProjectFileMutationVariables
>;

/**
 * __useMoveProjectFileMutation__
 *
 * To run a mutation, you first call `useMoveProjectFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveProjectFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveProjectFileMutation, { data, loading, error }] = useMoveProjectFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      destinationIndex: // value for 'destinationIndex'
 *   },
 * });
 */
export function useMoveProjectFileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MoveProjectFileMutationData,
    MoveProjectFileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MoveProjectFileMutationData, MoveProjectFileMutationVariables>(
    MoveProjectFileDocument,
    options,
  );
}
export type MoveProjectFileMutationHookResult = ReturnType<typeof useMoveProjectFileMutation>;
export type MoveProjectFileMutationResult = Apollo.MutationResult<MoveProjectFileMutationData>;
export type MoveProjectFileMutationOptions = Apollo.BaseMutationOptions<
  MoveProjectFileMutationData,
  MoveProjectFileMutationVariables
>;
export const DeleteProjectFileDocument = gql`
  mutation DeleteProjectFile($id: ID!) {
    deleteProjectFile(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteProjectFileMutationFn = Apollo.MutationFunction<
  DeleteProjectFileMutationData,
  DeleteProjectFileMutationVariables
>;

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
export function useDeleteProjectFileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProjectFileMutationData,
    DeleteProjectFileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>(
    DeleteProjectFileDocument,
    options,
  );
}
export type DeleteProjectFileMutationHookResult = ReturnType<typeof useDeleteProjectFileMutation>;
export type DeleteProjectFileMutationResult = Apollo.MutationResult<DeleteProjectFileMutationData>;
export type DeleteProjectFileMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectFileMutationData,
  DeleteProjectFileMutationVariables
>;
export const CreateProjectLinkDocument = gql`
  mutation CreateProjectLink($projectId: ID!, $projectLinkAttributes: ProjectLinkAttributes!) {
    createProjectLink(
      input: { projectId: $projectId, projectLinkAttributes: $projectLinkAttributes }
    ) {
      projectLink {
        ...ProjectLinkFieldsFragment
      }
    }
  }
  ${ProjectLinkFieldsFragmentDoc}
`;
export type CreateProjectLinkMutationFn = Apollo.MutationFunction<
  CreateProjectLinkMutationData,
  CreateProjectLinkMutationVariables
>;

/**
 * __useCreateProjectLinkMutation__
 *
 * To run a mutation, you first call `useCreateProjectLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectLinkMutation, { data, loading, error }] = useCreateProjectLinkMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      projectLinkAttributes: // value for 'projectLinkAttributes'
 *   },
 * });
 */
export function useCreateProjectLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProjectLinkMutationData,
    CreateProjectLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateProjectLinkMutationData, CreateProjectLinkMutationVariables>(
    CreateProjectLinkDocument,
    options,
  );
}
export type CreateProjectLinkMutationHookResult = ReturnType<typeof useCreateProjectLinkMutation>;
export type CreateProjectLinkMutationResult = Apollo.MutationResult<CreateProjectLinkMutationData>;
export type CreateProjectLinkMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectLinkMutationData,
  CreateProjectLinkMutationVariables
>;
export const UpdateProjectLinkDocument = gql`
  mutation UpdateProjectLink($id: ID!, $projectLinkAttributes: ProjectLinkAttributes!) {
    updateProjectLink(input: { id: $id, projectLinkAttributes: $projectLinkAttributes }) {
      projectLink {
        ...ProjectLinkFieldsFragment
      }
    }
  }
  ${ProjectLinkFieldsFragmentDoc}
`;
export type UpdateProjectLinkMutationFn = Apollo.MutationFunction<
  UpdateProjectLinkMutationData,
  UpdateProjectLinkMutationVariables
>;

/**
 * __useUpdateProjectLinkMutation__
 *
 * To run a mutation, you first call `useUpdateProjectLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectLinkMutation, { data, loading, error }] = useUpdateProjectLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      projectLinkAttributes: // value for 'projectLinkAttributes'
 *   },
 * });
 */
export function useUpdateProjectLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProjectLinkMutationData,
    UpdateProjectLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectLinkMutationData, UpdateProjectLinkMutationVariables>(
    UpdateProjectLinkDocument,
    options,
  );
}
export type UpdateProjectLinkMutationHookResult = ReturnType<typeof useUpdateProjectLinkMutation>;
export type UpdateProjectLinkMutationResult = Apollo.MutationResult<UpdateProjectLinkMutationData>;
export type UpdateProjectLinkMutationOptions = Apollo.BaseMutationOptions<
  UpdateProjectLinkMutationData,
  UpdateProjectLinkMutationVariables
>;
export const MoveProjectLinkDocument = gql`
  mutation MoveProjectLink($id: ID!, $destinationIndex: Int!) {
    moveProjectLink(input: { id: $id, destinationIndex: $destinationIndex }) {
      project {
        ...ProjectFieldsFragment
      }
    }
  }
  ${ProjectFieldsFragmentDoc}
`;
export type MoveProjectLinkMutationFn = Apollo.MutationFunction<
  MoveProjectLinkMutationData,
  MoveProjectLinkMutationVariables
>;

/**
 * __useMoveProjectLinkMutation__
 *
 * To run a mutation, you first call `useMoveProjectLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveProjectLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveProjectLinkMutation, { data, loading, error }] = useMoveProjectLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      destinationIndex: // value for 'destinationIndex'
 *   },
 * });
 */
export function useMoveProjectLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MoveProjectLinkMutationData,
    MoveProjectLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MoveProjectLinkMutationData, MoveProjectLinkMutationVariables>(
    MoveProjectLinkDocument,
    options,
  );
}
export type MoveProjectLinkMutationHookResult = ReturnType<typeof useMoveProjectLinkMutation>;
export type MoveProjectLinkMutationResult = Apollo.MutationResult<MoveProjectLinkMutationData>;
export type MoveProjectLinkMutationOptions = Apollo.BaseMutationOptions<
  MoveProjectLinkMutationData,
  MoveProjectLinkMutationVariables
>;
export const DeleteProjectLinkDocument = gql`
  mutation DeleteProjectLink($id: ID!) {
    deleteProjectLink(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteProjectLinkMutationFn = Apollo.MutationFunction<
  DeleteProjectLinkMutationData,
  DeleteProjectLinkMutationVariables
>;

/**
 * __useDeleteProjectLinkMutation__
 *
 * To run a mutation, you first call `useDeleteProjectLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectLinkMutation, { data, loading, error }] = useDeleteProjectLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProjectLinkMutationData,
    DeleteProjectLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteProjectLinkMutationData, DeleteProjectLinkMutationVariables>(
    DeleteProjectLinkDocument,
    options,
  );
}
export type DeleteProjectLinkMutationHookResult = ReturnType<typeof useDeleteProjectLinkMutation>;
export type DeleteProjectLinkMutationResult = Apollo.MutationResult<DeleteProjectLinkMutationData>;
export type DeleteProjectLinkMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectLinkMutationData,
  DeleteProjectLinkMutationVariables
>;
