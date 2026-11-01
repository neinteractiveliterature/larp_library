/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type HomePageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type HomePageQueryData = {
  __typename: 'Query';
  projectPromotions: Array<{
    __typename: 'ProjectPromotion';
    id: string;
    project: {
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
  }>;
  tags: {
    __typename: 'TagConnection';
    edges: Array<{
      __typename: 'TagEdge';
      node: {
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
    }>;
  };
  tagCategories: {
    __typename: 'TagCategoryConnection';
    edges: Array<{
      __typename: 'TagCategoryEdge';
      node: {
        __typename: 'TagCategory';
        id: string;
        name: string;
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
};

export const HomePageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'HomePageQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectPromotions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectHeadersFragment' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tags' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'first' }, value: { kind: 'IntValue', value: '200' } },
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
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagCategories' },
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
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
} as unknown as DocumentNode<HomePageQueryData, HomePageQueryVariables>;
