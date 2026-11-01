/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SetReturnUrlMutationVariables = Types.Exact<{
  returnUrl: Types.Scalars['String']['input'];
}>;

export type SetReturnUrlMutationData = {
  __typename: 'Mutation';
  setReturnUrl?: { __typename: 'SetReturnUrlPayload'; clientMutationId?: string | null } | null;
};

export const SetReturnUrlDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetReturnUrl' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'returnUrl' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setReturnUrl' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'returnUrl' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'returnUrl' } },
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
} as unknown as DocumentNode<SetReturnUrlMutationData, SetReturnUrlMutationVariables>;
