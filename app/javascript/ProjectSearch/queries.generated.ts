/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ProjectHeadersFragment = {
  __typename: 'Project';
  id: string;
  title?: string | null;
  authors?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minFacilitators?: number | null;
  maxFacilitators?: number | null;
  publicationYear?: number | null;
  lengthQuantity?: number | null;
  lengthUnits?: string | null;
  brand: { __typename: 'Brand'; id: string; name: string; slug: string };
  tags: Array<{
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
  }>;
};

export type ProjectSearchQueryVariables = Types.Exact<{
  queryString?: Types.InputMaybe<Types.Scalars['String']['input']>;
  tag?: Types.InputMaybe<Types.Scalars['String']['input']>;
  title?: Types.InputMaybe<Types.Scalars['String']['input']>;
  authors?: Types.InputMaybe<Types.Scalars['String']['input']>;
  playerCountUpperBound?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  playerCountLowerBound?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  facilitatorCountUpperBound?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  facilitatorCountLowerBound?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type ProjectSearchQueryData = {
  __typename: 'Query';
  projects: {
    __typename: 'ProjectConnection';
    totalCount: number;
    pageInfo: { __typename: 'PageInfo'; endCursor?: string | null };
    edges: Array<{
      __typename: 'ProjectEdge';
      node: {
        __typename: 'Project';
        id: string;
        description?: string | null;
        title?: string | null;
        authors?: string | null;
        minPlayers?: number | null;
        maxPlayers?: number | null;
        minFacilitators?: number | null;
        maxFacilitators?: number | null;
        publicationYear?: number | null;
        lengthQuantity?: number | null;
        lengthUnits?: string | null;
        brand: { __typename: 'Brand'; id: string; name: string; slug: string };
        tags: Array<{
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
        }>;
      };
    }>;
  };
  tagByName?: {
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
  } | null;
};

export const ProjectSearchQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProjectSearchQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'queryString' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tag' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'title' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'authors' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'playerCountUpperBound' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'playerCountLowerBound' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'facilitatorCountUpperBound' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'facilitatorCountLowerBound' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
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
            name: { kind: 'Name', value: 'projects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'queryString' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'queryString' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tag' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'tag' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'title' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'title' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'authors' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'authors' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'playerCountUpperBound' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'playerCountUpperBound' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'playerCountLowerBound' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'playerCountLowerBound' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'facilitatorCountUpperBound' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'facilitatorCountUpperBound' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'facilitatorCountLowerBound' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'facilitatorCountLowerBound' } },
              },
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
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectHeadersFragment' } },
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
            kind: 'Field',
            name: { kind: 'Name', value: 'tagByName' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'tag' } },
              },
            ],
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
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectHeadersFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'authors' } },
          { kind: 'Field', name: { kind: 'Name', value: 'minPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'maxPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'minFacilitators' } },
          { kind: 'Field', name: { kind: 'Name', value: 'maxFacilitators' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publicationYear' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lengthQuantity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lengthUnits' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tags' },
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
} as unknown as DocumentNode<ProjectSearchQueryData, ProjectSearchQueryVariables>;
