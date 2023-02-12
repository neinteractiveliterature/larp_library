/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { TagFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateTagMutationVariables = Types.Exact<{
  tagAttributes: Types.TagAttributes;
}>;

export type CreateTagMutationData = {
  __typename: 'Mutation';
  createTag?: {
    __typename: 'CreateTagPayload';
    tag: {
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
    };
  } | null;
};

export type UpdateTagMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  tagAttributes: Types.TagAttributes;
}>;

export type UpdateTagMutationData = {
  __typename: 'Mutation';
  updateTag?: {
    __typename: 'UpdateTagPayload';
    tag: {
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
    };
  } | null;
};

export type DeleteTagMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeleteTagMutationData = {
  __typename: 'Mutation';
  deleteTag?: { __typename: 'DeleteTagPayload'; clientMutationId?: string | null } | null;
};

export const CreateTagDocument = gql`
  mutation CreateTag($tagAttributes: TagAttributes!) {
    createTag(input: { tagAttributes: $tagAttributes }) {
      tag {
        ...TagFragment
      }
    }
  }
  ${TagFragmentDoc}
`;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutationData, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      tagAttributes: // value for 'tagAttributes'
 *   },
 * });
 */
export function useCreateTagMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateTagMutationData, CreateTagMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTagMutationData, CreateTagMutationVariables>(CreateTagDocument, options);
}
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutationData>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutationData, CreateTagMutationVariables>;
export const UpdateTagDocument = gql`
  mutation UpdateTag($id: ID!, $tagAttributes: TagAttributes!) {
    updateTag(input: { id: $id, tagAttributes: $tagAttributes }) {
      tag {
        ...TagFragment
      }
    }
  }
  ${TagFragmentDoc}
`;
export type UpdateTagMutationFn = Apollo.MutationFunction<UpdateTagMutationData, UpdateTagMutationVariables>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      tagAttributes: // value for 'tagAttributes'
 *   },
 * });
 */
export function useUpdateTagMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateTagMutationData, UpdateTagMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateTagMutationData, UpdateTagMutationVariables>(UpdateTagDocument, options);
}
export type UpdateTagMutationHookResult = ReturnType<typeof useUpdateTagMutation>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutationData>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<UpdateTagMutationData, UpdateTagMutationVariables>;
export const DeleteTagDocument = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteTagMutationFn = Apollo.MutationFunction<DeleteTagMutationData, DeleteTagMutationVariables>;

/**
 * __useDeleteTagMutation__
 *
 * To run a mutation, you first call `useDeleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagMutation, { data, loading, error }] = useDeleteTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTagMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTagMutationData, DeleteTagMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTagMutationData, DeleteTagMutationVariables>(DeleteTagDocument, options);
}
export type DeleteTagMutationHookResult = ReturnType<typeof useDeleteTagMutation>;
export type DeleteTagMutationResult = Apollo.MutationResult<DeleteTagMutationData>;
export type DeleteTagMutationOptions = Apollo.BaseMutationOptions<DeleteTagMutationData, DeleteTagMutationVariables>;
