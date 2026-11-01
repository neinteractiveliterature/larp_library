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

export const ProjectHeadersFragmentDoc = {
  kind: 'Document',
  definitions: [
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
} as unknown as DocumentNode<ProjectHeadersFragment, unknown>;
