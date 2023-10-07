/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SetReturnUrlMutationVariables = Types.Exact<{
  returnUrl: Types.Scalars['String']['input'];
}>;

export type SetReturnUrlMutationData = {
  __typename: 'Mutation';
  setReturnUrl?: { __typename: 'SetReturnUrlPayload'; clientMutationId?: string | null } | null;
};

export const SetReturnUrlDocument = gql`
  mutation SetReturnUrl($returnUrl: String!) {
    setReturnUrl(input: { returnUrl: $returnUrl }) {
      clientMutationId
    }
  }
`;
export type SetReturnUrlMutationFn = Apollo.MutationFunction<SetReturnUrlMutationData, SetReturnUrlMutationVariables>;

/**
 * __useSetReturnUrlMutation__
 *
 * To run a mutation, you first call `useSetReturnUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetReturnUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setReturnUrlMutation, { data, loading, error }] = useSetReturnUrlMutation({
 *   variables: {
 *      returnUrl: // value for 'returnUrl'
 *   },
 * });
 */
export function useSetReturnUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<SetReturnUrlMutationData, SetReturnUrlMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SetReturnUrlMutationData, SetReturnUrlMutationVariables>(SetReturnUrlDocument, options);
}
export type SetReturnUrlMutationHookResult = ReturnType<typeof useSetReturnUrlMutation>;
export type SetReturnUrlMutationResult = Apollo.MutationResult<SetReturnUrlMutationData>;
export type SetReturnUrlMutationOptions = Apollo.BaseMutationOptions<
  SetReturnUrlMutationData,
  SetReturnUrlMutationVariables
>;
