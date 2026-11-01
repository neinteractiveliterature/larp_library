/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ProjectFileFieldsFragment = {
  __typename: 'ProjectFile';
  id: string;
  url: string;
  filename: string;
  filesize: number;
  filetype?: string | null;
  position: number;
};

export type ProjectLinkFieldsFragment = {
  __typename: 'ProjectLink';
  id: string;
  url: string;
  title: string;
  icon?: string | null;
  position: number;
};

export type LicenseFieldsFragment = {
  __typename: 'License';
  id: string;
  name: string;
  url: string;
  logoUrl?: string | null;
  dedicationHtml?: string | null;
  discouraged: boolean;
  discouragedReason?: string | null;
};

export type NewProjectFormQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type NewProjectFormQueryData = {
  __typename: 'Query';
  brand: { __typename: 'Brand'; id: string };
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

export type ProjectFieldsFragment = {
  __typename: 'Project';
  id: string;
  description?: string | null;
  currentUserCanEdit: boolean;
  currentUserCanDelete: boolean;
  currentUserCanUploadFiles: boolean;
  currentUserCanDeleteFiles: boolean;
  title?: string | null;
  authors?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minFacilitators?: number | null;
  maxFacilitators?: number | null;
  publicationYear?: number | null;
  lengthQuantity?: number | null;
  lengthUnits?: string | null;
  license?: {
    __typename: 'License';
    id: string;
    name: string;
    url: string;
    logoUrl?: string | null;
    dedicationHtml?: string | null;
    discouraged: boolean;
    discouragedReason?: string | null;
  } | null;
  projectFiles: Array<{
    __typename: 'ProjectFile';
    id: string;
    url: string;
    filename: string;
    filesize: number;
    filetype?: string | null;
    position: number;
  }>;
  projectLinks: Array<{
    __typename: 'ProjectLink';
    id: string;
    url: string;
    title: string;
    icon?: string | null;
    position: number;
  }>;
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

export type ProjectPageQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID']['input'];
}>;

export type ProjectPageQueryData = {
  __typename: 'Query';
  project: {
    __typename: 'Project';
    id: string;
    description?: string | null;
    currentUserCanEdit: boolean;
    currentUserCanDelete: boolean;
    currentUserCanUploadFiles: boolean;
    currentUserCanDeleteFiles: boolean;
    title?: string | null;
    authors?: string | null;
    minPlayers?: number | null;
    maxPlayers?: number | null;
    minFacilitators?: number | null;
    maxFacilitators?: number | null;
    publicationYear?: number | null;
    lengthQuantity?: number | null;
    lengthUnits?: string | null;
    license?: {
      __typename: 'License';
      id: string;
      name: string;
      url: string;
      logoUrl?: string | null;
      dedicationHtml?: string | null;
      discouraged: boolean;
      discouragedReason?: string | null;
    } | null;
    projectFiles: Array<{
      __typename: 'ProjectFile';
      id: string;
      url: string;
      filename: string;
      filesize: number;
      filetype?: string | null;
      position: number;
    }>;
    projectLinks: Array<{
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: string | null;
      position: number;
    }>;
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

export type SignRequestQueryVariables = Types.Exact<{
  httpMethod: Types.Scalars['String']['input'];
  url: Types.Scalars['String']['input'];
  headers: Types.Scalars['JSON']['input'];
}>;

export type SignRequestQueryData = { __typename: 'Query'; presignS3Url: string };

export const NewProjectFormQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'NewProjectFormQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'brand' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'licenses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'LicenseFieldsFragment' } }],
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
} as unknown as DocumentNode<NewProjectFormQueryData, NewProjectFormQueryVariables>;
export const ProjectPageQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProjectPageQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'project' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFieldsFragment' } }],
            },
          },
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
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFileFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectFile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'filename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'filesize' } },
          { kind: 'Field', name: { kind: 'Name', value: 'filetype' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectLinkFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectLink' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanEdit' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanDelete' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanUploadFiles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentUserCanDeleteFiles' } },
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectHeadersFragment' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'license' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'LicenseFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectFiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFileFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectLinks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectLinkFieldsFragment' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectPageQueryData, ProjectPageQueryVariables>;
export const SignRequestQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SignRequestQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'httpMethod' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'url' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'headers' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'JSON' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'presignS3Url' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'httpMethod' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'httpMethod' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'url' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'url' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'headers' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'headers' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignRequestQueryData, SignRequestQueryVariables>;
