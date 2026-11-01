/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppLayoutQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AppLayoutQueryData = {
  __typename: 'Query';
  currentUser?: { __typename: 'User'; id: string; admin?: boolean | null } | null;
  currentAbility: {
    __typename: 'Ability';
    canApproveBrands: boolean;
    canCreateProjectPromotions: boolean;
    canUpdateTags: boolean;
    canUpdateTagCategories: boolean;
  };
};

export const AppLayoutQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AppLayoutQuery' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'admin' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentAbility' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'canApproveBrands' } },
                { kind: 'Field', name: { kind: 'Name', value: 'canCreateProjectPromotions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'canUpdateTags' } },
                { kind: 'Field', name: { kind: 'Name', value: 'canUpdateTagCategories' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AppLayoutQueryData, AppLayoutQueryVariables>;
