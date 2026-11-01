/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ProjectPromotionFieldsFragment = {
  __typename: 'ProjectPromotion';
  id: string;
  createdAt: any;
  project: {
    __typename: 'Project';
    id: string;
    title?: string | null;
    brand: { __typename: 'Brand'; id: string; slug: string };
  };
};

export type ProjectPromotionsPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ProjectPromotionsPageQueryData = {
  __typename: 'Query';
  projectPromotions: Array<{
    __typename: 'ProjectPromotion';
    id: string;
    createdAt: any;
    project: {
      __typename: 'Project';
      id: string;
      title?: string | null;
      brand: { __typename: 'Brand'; id: string; slug: string };
    };
  }>;
};

export const ProjectPromotionsPageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProjectPromotionsPageQuery' },
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
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectPromotionFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectPromotionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectPromotion' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'project' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'brand' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
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
} as unknown as DocumentNode<ProjectPromotionsPageQueryData, ProjectPromotionsPageQueryVariables>;
