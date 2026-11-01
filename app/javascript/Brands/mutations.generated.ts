/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export const CreateBrandDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateBrand' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandAttributes' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'BrandAttributes' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createBrand' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'brandAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'brandAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brand' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'BrandPageBrandFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BrandPageBrandFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Brand' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'approved' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanEdit' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanCreateProjects' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateBrandMutationData, CreateBrandMutationVariables>;
export const UpdateBrandDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateBrand' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandAttributes' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'BrandAttributes' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateBrand' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'brandAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'brandAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brand' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'BrandPageBrandFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BrandPageBrandFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Brand' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'approved' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanEdit' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanCreateProjects' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateBrandMutationData, UpdateBrandMutationVariables>;
export const ApproveBrandDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ApproveBrand' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'approveBrand' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brand' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'BrandPageBrandFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BrandPageBrandFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Brand' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'approved' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanEdit' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanCreateProjects' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ApproveBrandMutationData, ApproveBrandMutationVariables>;
export const InviteBrandMemberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'InviteBrandMember' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'admin' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'inviteBrandMember' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'brandId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'brandId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'email' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'admin' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'admin' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brandMembership' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'BrandMembershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BrandMembershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BrandMembership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'admin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'invitationEmail' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InviteBrandMemberMutationData, InviteBrandMemberMutationVariables>;
export const DeleteBrandMembershipDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteBrandMembership' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteBrandMembership' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteBrandMembershipMutationData, DeleteBrandMembershipMutationVariables>;
