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

export type TagListPageQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type TagListPageQueryData = {
  __typename: 'Query';
  tags: {
    __typename: 'TagConnection';
    totalCount: number;
    pageInfo: { __typename: 'PageInfo'; endCursor?: string | null };
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

export type EditTagQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type EditTagQueryData = {
  __typename: 'Query';
  tag: {
    __typename: 'Tag';
    id: string;
    name: string;
    projects: { __typename: 'ProjectConnection'; totalCount: number };
    tagCategory?: {
      __typename: 'TagCategory';
      id: string;
      name: string;
      color?: string | null;
      textColor?: string | null;
      icon?: string | null;
    } | null;
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
export const TagListPageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'TagListPageQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
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
              { kind: 'Argument', name: { kind: 'Name', value: 'first' }, value: { kind: 'IntValue', value: '25' } },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'endCursor' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
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
} as unknown as DocumentNode<TagListPageQueryData, TagListPageQueryVariables>;
export const EditTagQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'EditTagQuery' },
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
            name: { kind: 'Name', value: 'tag' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TagFragment' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projects' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'totalCount' } }],
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
} as unknown as DocumentNode<EditTagQueryData, EditTagQueryVariables>;
