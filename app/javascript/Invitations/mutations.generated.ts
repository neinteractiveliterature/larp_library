/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AcceptBrandMembershipInvitationMutationVariables = Types.Exact<{
  brandId: Types.Scalars['ID']['input'];
  invitationToken: Types.Scalars['String']['input'];
}>;

export type AcceptBrandMembershipInvitationMutationData = {
  __typename: 'Mutation';
  acceptBrandMembershipInvitation?: {
    __typename: 'AcceptBrandMembershipInvitationPayload';
    clientMutationId?: string | null;
  } | null;
};

export const AcceptBrandMembershipInvitationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AcceptBrandMembershipInvitation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
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
            name: { kind: 'Name', value: 'acceptBrandMembershipInvitation' },
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
                      name: { kind: 'Name', value: 'invitationToken' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'invitationToken' } },
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
} as unknown as DocumentNode<
  AcceptBrandMembershipInvitationMutationData,
  AcceptBrandMembershipInvitationMutationVariables
>;
