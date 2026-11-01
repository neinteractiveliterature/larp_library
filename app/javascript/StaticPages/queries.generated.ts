/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type LicensingPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type LicensingPageQueryData = {
  __typename: 'Query';
  licenses: Array<{
    __typename: 'License';
    id: string;
    name: string;
    url: string;
    logoUrl?: string | null;
    dedicationHtml?: string | null;
    discouraged: boolean;
    discouragedReason?: string | null;
  }>;
};

export const LicensingPageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'LicensingPageQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'licenses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'LicenseFieldsFragment' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LicenseFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'License' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'logoUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dedicationHtml' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discouraged' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discouragedReason' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LicensingPageQueryData, LicensingPageQueryVariables>;
