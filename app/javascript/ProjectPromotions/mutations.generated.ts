/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ProjectPromotionFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type PromoteProjectMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
}>;

export type PromoteProjectMutationData = {
  __typename: 'Mutation';
  promoteProject?: Types.Maybe<{
    __typename: 'PromoteProjectPayload';
    projectPromotion: {
      __typename: 'ProjectPromotion';
      id: string;
      createdAt: any;
      project: {
        __typename: 'Project';
        id: string;
        title?: Types.Maybe<string>;
        brand: { __typename: 'Brand'; id: string; slug: string };
      };
    };
  }>;
};

export type UnpromoteProjectMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
}>;

export type UnpromoteProjectMutationData = {
  __typename: 'Mutation';
  unpromoteProject?: Types.Maybe<{
    __typename: 'UnpromoteProjectPayload';
    projectPromotion: {
      __typename: 'ProjectPromotion';
      id: string;
      createdAt: any;
      project: {
        __typename: 'Project';
        id: string;
        title?: Types.Maybe<string>;
        brand: { __typename: 'Brand'; id: string; slug: string };
      };
    };
  }>;
};

export const PromoteProjectMutationDocument = gql`
  mutation PromoteProjectMutation($projectId: ID!) {
    promoteProject(input: { projectId: $projectId }) {
      projectPromotion {
        id
        ...ProjectPromotionFields
      }
    }
  }
  ${ProjectPromotionFieldsFragmentDoc}
`;
export type PromoteProjectMutationMutationFn = Apollo.MutationFunction<
  PromoteProjectMutationData,
  PromoteProjectMutationVariables
>;

/**
 * __usePromoteProjectMutation__
 *
 * To run a mutation, you first call `usePromoteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromoteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promoteProjectMutation, { data, loading, error }] = usePromoteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function usePromoteProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PromoteProjectMutationData,
    PromoteProjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PromoteProjectMutationData, PromoteProjectMutationVariables>(
    PromoteProjectMutationDocument,
    options,
  );
}
export type PromoteProjectMutationHookResult = ReturnType<typeof usePromoteProjectMutation>;
export type PromoteProjectMutationMutationResult =
  Apollo.MutationResult<PromoteProjectMutationData>;
export type PromoteProjectMutationMutationOptions = Apollo.BaseMutationOptions<
  PromoteProjectMutationData,
  PromoteProjectMutationVariables
>;
export const UnpromoteProjectMutationDocument = gql`
  mutation UnpromoteProjectMutation($projectId: ID!) {
    unpromoteProject(input: { projectId: $projectId }) {
      projectPromotion {
        id
        ...ProjectPromotionFields
      }
    }
  }
  ${ProjectPromotionFieldsFragmentDoc}
`;
export type UnpromoteProjectMutationMutationFn = Apollo.MutationFunction<
  UnpromoteProjectMutationData,
  UnpromoteProjectMutationVariables
>;

/**
 * __useUnpromoteProjectMutation__
 *
 * To run a mutation, you first call `useUnpromoteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpromoteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpromoteProjectMutation, { data, loading, error }] = useUnpromoteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useUnpromoteProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnpromoteProjectMutationData,
    UnpromoteProjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnpromoteProjectMutationData, UnpromoteProjectMutationVariables>(
    UnpromoteProjectMutationDocument,
    options,
  );
}
export type UnpromoteProjectMutationHookResult = ReturnType<typeof useUnpromoteProjectMutation>;
export type UnpromoteProjectMutationMutationResult =
  Apollo.MutationResult<UnpromoteProjectMutationData>;
export type UnpromoteProjectMutationMutationOptions = Apollo.BaseMutationOptions<
  UnpromoteProjectMutationData,
  UnpromoteProjectMutationVariables
>;
