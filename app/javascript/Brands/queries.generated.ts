/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BrandPageBrandFieldsFragment = {
  __typename: 'Brand';
  id: string;
  approved?: boolean | null;
  name: string;
  description?: string | null;
  slug: string;
  currentUserCanEdit: boolean;
  currentUserCanCreateProjects: boolean;
};

export type NewBrandQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NewBrandQueryData = {
  __typename: 'Query';
  currentUser?: {
    __typename: 'User';
    id: string;
    name: string;
    brands: Array<{ __typename: 'Brand'; id: string; name: string; slug: string }>;
  } | null;
};

export type BrandMembershipFieldsFragment = {
  __typename: 'BrandMembership';
  id: string;
  admin: boolean;
  invitationEmail?: string | null;
  user?: { __typename: 'User'; id: string; name: string; email?: string | null } | null;
};

export type EditBrandQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type EditBrandQueryData = {
  __typename: 'Query';
  brand: {
    __typename: 'Brand';
    id: string;
    approved?: boolean | null;
    name: string;
    slug: string;
    description?: string | null;
    currentUserCanManageMemberships: boolean;
    brandMemberships: Array<{
      __typename: 'BrandMembership';
      id: string;
      admin: boolean;
      invitationEmail?: string | null;
      user?: { __typename: 'User'; id: string; name: string; email?: string | null } | null;
    }>;
  };
  currentUser?: { __typename: 'User'; id: string } | null;
};

export const BrandPageBrandFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
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
} as unknown as DocumentNode<BrandPageBrandFieldsFragment, unknown>;
export const NewBrandQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'NewBrandQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brands' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewBrandQueryData, NewBrandQueryVariables>;
export const EditBrandQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'EditBrandQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'brand' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'approved' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanManageMemberships' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brandMemberships' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'BrandMembershipFields' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
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
} as unknown as DocumentNode<EditBrandQueryData, EditBrandQueryVariables>;
