/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InvitationPageQueryVariables = Types.Exact<{
  brandSlug: Types.Scalars['String']['input'];
  invitationToken: Types.Scalars['String']['input'];
}>;

export type InvitationPageQueryData = {
  __typename: 'Query';
  brandMembership: {
    __typename: 'BrandMembership';
    id: string;
    admin: boolean;
    brand: { __typename: 'Brand'; id: string; name: string; slug: string };
  };
  currentUser?: { __typename: 'User'; id: string } | null;
};

export const InvitationPageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InvitationPageQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandSlug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'invitationToken' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'brandMembership' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'brandSlug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'brandSlug' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'invitationToken' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'invitationToken' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'admin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brand' },
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
  ],
} as unknown as DocumentNode<InvitationPageQueryData, InvitationPageQueryVariables>;
