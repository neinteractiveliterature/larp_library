/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { TagCategoryFragmentDoc } from './TagCategoryFragment.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type CreateTagCategoryMutationVariables = Types.Exact<{
  tagCategoryAttributes: Types.TagCategoryAttributes;
}>;

export type CreateTagCategoryMutationData = {
  __typename: 'Mutation';
  createTagCategory?: Types.Maybe<{
    __typename: 'CreateTagCategoryPayload';
    tagCategory: {
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: Types.Maybe<string>;
      textColor?: Types.Maybe<string>;
      icon?: Types.Maybe<string>;
    };
  }>;
};

export type UpdateTagCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  tagCategoryAttributes: Types.TagCategoryAttributes;
}>;

export type UpdateTagCategoryMutationData = {
  __typename: 'Mutation';
  updateTagCategory?: Types.Maybe<{
    __typename: 'UpdateTagCategoryPayload';
    tagCategory: {
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: Types.Maybe<string>;
      textColor?: Types.Maybe<string>;
      icon?: Types.Maybe<string>;
    };
  }>;
};

export type DeleteTagCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeleteTagCategoryMutationData = {
  __typename: 'Mutation';
  deleteTagCategory?: Types.Maybe<{
    __typename: 'DeleteTagCategoryPayload';
    clientMutationId?: Types.Maybe<string>;
  }>;
};

export const CreateTagCategoryDocument = gql`
  mutation CreateTagCategory($tagCategoryAttributes: TagCategoryAttributes!) {
    createTagCategory(input: { tagCategoryAttributes: $tagCategoryAttributes }) {
      tagCategory {
        ...TagCategoryFragment
      }
    }
  }
  ${TagCategoryFragmentDoc}
`;
export type CreateTagCategoryMutationFn = Apollo.MutationFunction<
  CreateTagCategoryMutationData,
  CreateTagCategoryMutationVariables
>;

/**
 * __useCreateTagCategoryMutation__
 *
 * To run a mutation, you first call `useCreateTagCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagCategoryMutation, { data, loading, error }] = useCreateTagCategoryMutation({
 *   variables: {
 *      tagCategoryAttributes: // value for 'tagCategoryAttributes'
 *   },
 * });
 */
export function useCreateTagCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTagCategoryMutationData,
    CreateTagCategoryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTagCategoryMutationData, CreateTagCategoryMutationVariables>(
    CreateTagCategoryDocument,
    options,
  );
}
export type CreateTagCategoryMutationHookResult = ReturnType<typeof useCreateTagCategoryMutation>;
export type CreateTagCategoryMutationResult = Apollo.MutationResult<CreateTagCategoryMutationData>;
export type CreateTagCategoryMutationOptions = Apollo.BaseMutationOptions<
  CreateTagCategoryMutationData,
  CreateTagCategoryMutationVariables
>;
export const UpdateTagCategoryDocument = gql`
  mutation UpdateTagCategory($id: ID!, $tagCategoryAttributes: TagCategoryAttributes!) {
    updateTagCategory(input: { id: $id, tagCategoryAttributes: $tagCategoryAttributes }) {
      tagCategory {
        ...TagCategoryFragment
      }
    }
  }
  ${TagCategoryFragmentDoc}
`;
export type UpdateTagCategoryMutationFn = Apollo.MutationFunction<
  UpdateTagCategoryMutationData,
  UpdateTagCategoryMutationVariables
>;

/**
 * __useUpdateTagCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateTagCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagCategoryMutation, { data, loading, error }] = useUpdateTagCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      tagCategoryAttributes: // value for 'tagCategoryAttributes'
 *   },
 * });
 */
export function useUpdateTagCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTagCategoryMutationData,
    UpdateTagCategoryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateTagCategoryMutationData, UpdateTagCategoryMutationVariables>(
    UpdateTagCategoryDocument,
    options,
  );
}
export type UpdateTagCategoryMutationHookResult = ReturnType<typeof useUpdateTagCategoryMutation>;
export type UpdateTagCategoryMutationResult = Apollo.MutationResult<UpdateTagCategoryMutationData>;
export type UpdateTagCategoryMutationOptions = Apollo.BaseMutationOptions<
  UpdateTagCategoryMutationData,
  UpdateTagCategoryMutationVariables
>;
export const DeleteTagCategoryDocument = gql`
  mutation DeleteTagCategory($id: ID!) {
    deleteTagCategory(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteTagCategoryMutationFn = Apollo.MutationFunction<
  DeleteTagCategoryMutationData,
  DeleteTagCategoryMutationVariables
>;

/**
 * __useDeleteTagCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteTagCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagCategoryMutation, { data, loading, error }] = useDeleteTagCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTagCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTagCategoryMutationData,
    DeleteTagCategoryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTagCategoryMutationData, DeleteTagCategoryMutationVariables>(
    DeleteTagCategoryDocument,
    options,
  );
}
export type DeleteTagCategoryMutationHookResult = ReturnType<typeof useDeleteTagCategoryMutation>;
export type DeleteTagCategoryMutationResult = Apollo.MutationResult<DeleteTagCategoryMutationData>;
export type DeleteTagCategoryMutationOptions = Apollo.BaseMutationOptions<
  DeleteTagCategoryMutationData,
  DeleteTagCategoryMutationVariables
>;
