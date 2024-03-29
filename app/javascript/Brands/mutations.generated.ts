/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { BrandPageBrandFieldsFragmentDoc, BrandMembershipFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateBrandMutationVariables = Types.Exact<{
  brandAttributes: Types.BrandAttributes;
}>;

export type CreateBrandMutationData = {
  __typename: 'Mutation';
  createBrand?: {
    __typename: 'CreateBrandPayload';
    brand: {
      __typename: 'Brand';
      id: string;
      approved?: boolean | null;
      name: string;
      description?: string | null;
      slug: string;
      currentUserCanEdit: boolean;
      currentUserCanCreateProjects: boolean;
    };
  } | null;
};

export type UpdateBrandMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  brandAttributes: Types.BrandAttributes;
}>;

export type UpdateBrandMutationData = {
  __typename: 'Mutation';
  updateBrand?: {
    __typename: 'UpdateBrandPayload';
    brand: {
      __typename: 'Brand';
      id: string;
      approved?: boolean | null;
      name: string;
      description?: string | null;
      slug: string;
      currentUserCanEdit: boolean;
      currentUserCanCreateProjects: boolean;
    };
  } | null;
};

export type ApproveBrandMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type ApproveBrandMutationData = {
  __typename: 'Mutation';
  approveBrand?: {
    __typename: 'ApproveBrandPayload';
    brand: {
      __typename: 'Brand';
      id: string;
      approved?: boolean | null;
      name: string;
      description?: string | null;
      slug: string;
      currentUserCanEdit: boolean;
      currentUserCanCreateProjects: boolean;
    };
  } | null;
};

export type InviteBrandMemberMutationVariables = Types.Exact<{
  brandId: Types.Scalars['ID']['input'];
  email: Types.Scalars['String']['input'];
  admin: Types.Scalars['Boolean']['input'];
}>;

export type InviteBrandMemberMutationData = {
  __typename: 'Mutation';
  inviteBrandMember?: {
    __typename: 'InviteBrandMemberPayload';
    brandMembership: {
      __typename: 'BrandMembership';
      id: string;
      admin: boolean;
      invitationEmail?: string | null;
      user?: { __typename: 'User'; id: string; name: string; email?: string | null } | null;
    };
  } | null;
};

export type DeleteBrandMembershipMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteBrandMembershipMutationData = {
  __typename: 'Mutation';
  deleteBrandMembership?: { __typename: 'DeleteBrandMembershipPayload'; clientMutationId?: string | null } | null;
};

export const CreateBrandDocument = gql`
  mutation CreateBrand($brandAttributes: BrandAttributes!) {
    createBrand(input: { brandAttributes: $brandAttributes }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }
  ${BrandPageBrandFieldsFragmentDoc}
`;
export type CreateBrandMutationFn = Apollo.MutationFunction<CreateBrandMutationData, CreateBrandMutationVariables>;

/**
 * __useCreateBrandMutation__
 *
 * To run a mutation, you first call `useCreateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBrandMutation, { data, loading, error }] = useCreateBrandMutation({
 *   variables: {
 *      brandAttributes: // value for 'brandAttributes'
 *   },
 * });
 */
export function useCreateBrandMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateBrandMutationData, CreateBrandMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateBrandMutationData, CreateBrandMutationVariables>(CreateBrandDocument, options);
}
export type CreateBrandMutationHookResult = ReturnType<typeof useCreateBrandMutation>;
export type CreateBrandMutationResult = Apollo.MutationResult<CreateBrandMutationData>;
export type CreateBrandMutationOptions = Apollo.BaseMutationOptions<
  CreateBrandMutationData,
  CreateBrandMutationVariables
>;
export const UpdateBrandDocument = gql`
  mutation UpdateBrand($id: ID!, $brandAttributes: BrandAttributes!) {
    updateBrand(input: { id: $id, brandAttributes: $brandAttributes }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }
  ${BrandPageBrandFieldsFragmentDoc}
`;
export type UpdateBrandMutationFn = Apollo.MutationFunction<UpdateBrandMutationData, UpdateBrandMutationVariables>;

/**
 * __useUpdateBrandMutation__
 *
 * To run a mutation, you first call `useUpdateBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBrandMutation, { data, loading, error }] = useUpdateBrandMutation({
 *   variables: {
 *      id: // value for 'id'
 *      brandAttributes: // value for 'brandAttributes'
 *   },
 * });
 */
export function useUpdateBrandMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateBrandMutationData, UpdateBrandMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateBrandMutationData, UpdateBrandMutationVariables>(UpdateBrandDocument, options);
}
export type UpdateBrandMutationHookResult = ReturnType<typeof useUpdateBrandMutation>;
export type UpdateBrandMutationResult = Apollo.MutationResult<UpdateBrandMutationData>;
export type UpdateBrandMutationOptions = Apollo.BaseMutationOptions<
  UpdateBrandMutationData,
  UpdateBrandMutationVariables
>;
export const ApproveBrandDocument = gql`
  mutation ApproveBrand($id: ID!) {
    approveBrand(input: { id: $id }) {
      brand {
        id
        ...BrandPageBrandFields
      }
    }
  }
  ${BrandPageBrandFieldsFragmentDoc}
`;
export type ApproveBrandMutationFn = Apollo.MutationFunction<ApproveBrandMutationData, ApproveBrandMutationVariables>;

/**
 * __useApproveBrandMutation__
 *
 * To run a mutation, you first call `useApproveBrandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveBrandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveBrandMutation, { data, loading, error }] = useApproveBrandMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApproveBrandMutation(
  baseOptions?: Apollo.MutationHookOptions<ApproveBrandMutationData, ApproveBrandMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ApproveBrandMutationData, ApproveBrandMutationVariables>(ApproveBrandDocument, options);
}
export type ApproveBrandMutationHookResult = ReturnType<typeof useApproveBrandMutation>;
export type ApproveBrandMutationResult = Apollo.MutationResult<ApproveBrandMutationData>;
export type ApproveBrandMutationOptions = Apollo.BaseMutationOptions<
  ApproveBrandMutationData,
  ApproveBrandMutationVariables
>;
export const InviteBrandMemberDocument = gql`
  mutation InviteBrandMember($brandId: ID!, $email: String!, $admin: Boolean!) {
    inviteBrandMember(input: { brandId: $brandId, email: $email, admin: $admin }) {
      brandMembership {
        ...BrandMembershipFields
      }
    }
  }
  ${BrandMembershipFieldsFragmentDoc}
`;
export type InviteBrandMemberMutationFn = Apollo.MutationFunction<
  InviteBrandMemberMutationData,
  InviteBrandMemberMutationVariables
>;

/**
 * __useInviteBrandMemberMutation__
 *
 * To run a mutation, you first call `useInviteBrandMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteBrandMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteBrandMemberMutation, { data, loading, error }] = useInviteBrandMemberMutation({
 *   variables: {
 *      brandId: // value for 'brandId'
 *      email: // value for 'email'
 *      admin: // value for 'admin'
 *   },
 * });
 */
export function useInviteBrandMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<InviteBrandMemberMutationData, InviteBrandMemberMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<InviteBrandMemberMutationData, InviteBrandMemberMutationVariables>(
    InviteBrandMemberDocument,
    options,
  );
}
export type InviteBrandMemberMutationHookResult = ReturnType<typeof useInviteBrandMemberMutation>;
export type InviteBrandMemberMutationResult = Apollo.MutationResult<InviteBrandMemberMutationData>;
export type InviteBrandMemberMutationOptions = Apollo.BaseMutationOptions<
  InviteBrandMemberMutationData,
  InviteBrandMemberMutationVariables
>;
export const DeleteBrandMembershipDocument = gql`
  mutation DeleteBrandMembership($id: ID!) {
    deleteBrandMembership(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteBrandMembershipMutationFn = Apollo.MutationFunction<
  DeleteBrandMembershipMutationData,
  DeleteBrandMembershipMutationVariables
>;

/**
 * __useDeleteBrandMembershipMutation__
 *
 * To run a mutation, you first call `useDeleteBrandMembershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBrandMembershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBrandMembershipMutation, { data, loading, error }] = useDeleteBrandMembershipMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBrandMembershipMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteBrandMembershipMutationData, DeleteBrandMembershipMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteBrandMembershipMutationData, DeleteBrandMembershipMutationVariables>(
    DeleteBrandMembershipDocument,
    options,
  );
}
export type DeleteBrandMembershipMutationHookResult = ReturnType<typeof useDeleteBrandMembershipMutation>;
export type DeleteBrandMembershipMutationResult = Apollo.MutationResult<DeleteBrandMembershipMutationData>;
export type DeleteBrandMembershipMutationOptions = Apollo.BaseMutationOptions<
  DeleteBrandMembershipMutationData,
  DeleteBrandMembershipMutationVariables
>;
