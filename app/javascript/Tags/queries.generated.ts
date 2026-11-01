/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type TagFragment = {
  __typename: 'Tag';
  id: string;
  name: string;
  tagCategory?: {
    __typename: 'TagCategory';
    id: string;
    name: string;
    color?: string | null;
    textColor?: string | null;
    icon?: string | null;
  } | null;
};

export type TagAutocompleteQueryVariables = Types.Exact<{
  queryString?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type TagAutocompleteQueryData = {
  __typename: 'Query';
  tags: {
    __typename: 'TagConnection';
    edges: Array<{
      __typename: 'TagEdge';
      node: {
        __typename: 'Tag';
        id: string;
        name: string;
        tagCategory?: {
          __typename: 'TagCategory';
          id: string;
          name: string;
          color?: string | null;
          textColor?: string | null;
          icon?: string | null;
        } | null;
      };
    }>;
  };
};

export const TagAutocompleteQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'TagAutocompleteQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'queryString' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tags' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'queryString' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'queryString' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TagFragment' } },
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
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TagCategoryFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TagCategory' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'textColor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TagFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Tag' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagCategory' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TagCategoryFragment' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TagAutocompleteQueryData, TagAutocompleteQueryVariables>;
