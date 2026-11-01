/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateProjectMutationVariables = Types.Exact<{
  brandId: Types.Scalars['ID']['input'];
  projectAttributes: Types.ProjectAttributes;
}>;

export type CreateProjectMutationData = {
  __typename: 'Mutation';
  createProject?: {
    __typename: 'CreateProjectPayload';
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
  } | null;
};

export type UpdateProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  projectAttributes: Types.ProjectAttributes;
}>;

export type UpdateProjectMutationData = {
  __typename: 'Mutation';
  updateProject?: {
    __typename: 'UpdateProjectPayload';
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
  } | null;
};

export type DeleteProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteProjectMutationData = {
  __typename: 'Mutation';
  deleteProject?: { __typename: 'DeleteProjectPayload'; clientMutationId?: string | null } | null;
};

export type CompleteProjectFileUploadMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID']['input'];
  url: Types.Scalars['String']['input'];
  filename: Types.Scalars['String']['input'];
  filesize: Types.Scalars['Int']['input'];
  filetype?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filepath: Types.Scalars['String']['input'];
}>;

export type CompleteProjectFileUploadMutationData = {
  __typename: 'Mutation';
  completeProjectFileUpload?: {
    __typename: 'CompleteProjectFileUploadPayload';
    projectFile: {
      __typename: 'ProjectFile';
      id: string;
      url: string;
      filename: string;
      filesize: number;
      filetype?: string | null;
      position: number;
    };
  } | null;
};

export type MoveProjectFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  destinationIndex: Types.Scalars['Int']['input'];
}>;

export type MoveProjectFileMutationData = {
  __typename: 'Mutation';
  moveProjectFile?: {
    __typename: 'MoveProjectFilePayload';
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
  } | null;
};

export type DeleteProjectFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteProjectFileMutationData = {
  __typename: 'Mutation';
  deleteProjectFile?: { __typename: 'DeleteProjectFilePayload'; clientMutationId?: string | null } | null;
};

export type CreateProjectLinkMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID']['input'];
  projectLinkAttributes: Types.ProjectLinkAttributes;
}>;

export type CreateProjectLinkMutationData = {
  __typename: 'Mutation';
  createProjectLink?: {
    __typename: 'CreateProjectLinkPayload';
    projectLink: {
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: string | null;
      position: number;
    };
  } | null;
};

export type UpdateProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  projectLinkAttributes: Types.ProjectLinkAttributes;
}>;

export type UpdateProjectLinkMutationData = {
  __typename: 'Mutation';
  updateProjectLink?: {
    __typename: 'UpdateProjectLinkPayload';
    projectLink: {
      __typename: 'ProjectLink';
      id: string;
      url: string;
      title: string;
      icon?: string | null;
      position: number;
    };
  } | null;
};

export type MoveProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  destinationIndex: Types.Scalars['Int']['input'];
}>;

export type MoveProjectLinkMutationData = {
  __typename: 'Mutation';
  moveProjectLink?: {
    __typename: 'MoveProjectLinkPayload';
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
  } | null;
};

export type DeleteProjectLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteProjectLinkMutationData = {
  __typename: 'Mutation';
  deleteProjectLink?: { __typename: 'DeleteProjectLinkPayload'; clientMutationId?: string | null } | null;
};

export const CreateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'brandId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectAttributes' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectAttributes' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'brandId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'brandId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFieldsFragment' } }],
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
} as unknown as DocumentNode<CreateProjectMutationData, CreateProjectMutationVariables>;
export const UpdateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectAttributes' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectAttributes' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFieldsFragment' } }],
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
} as unknown as DocumentNode<UpdateProjectMutationData, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProject' },
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
            name: { kind: 'Name', value: 'deleteProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
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
} as unknown as DocumentNode<DeleteProjectMutationData, DeleteProjectMutationVariables>;
export const CompleteProjectFileUploadDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CompleteProjectFileUpload' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'url' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filename' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filesize' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filetype' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filepath' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'completeProjectFileUpload' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'url' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'url' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'filename' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'filename' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'filesize' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'filesize' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'filetype' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'filetype' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'filepath' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'filepath' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectFile' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFileFieldsFragment' } },
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
  ],
} as unknown as DocumentNode<CompleteProjectFileUploadMutationData, CompleteProjectFileUploadMutationVariables>;
export const MoveProjectFileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MoveProjectFile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'destinationIndex' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'moveProjectFile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'destinationIndex' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'destinationIndex' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFieldsFragment' } }],
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
} as unknown as DocumentNode<MoveProjectFileMutationData, MoveProjectFileMutationVariables>;
export const DeleteProjectFileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProjectFile' },
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
            name: { kind: 'Name', value: 'deleteProjectFile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
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
} as unknown as DocumentNode<DeleteProjectFileMutationData, DeleteProjectFileMutationVariables>;
export const CreateProjectLinkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProjectLink' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectLinkAttributes' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectLinkAttributes' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProjectLink' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectLinkAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectLinkAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectLink' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectLinkFieldsFragment' } },
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
  ],
} as unknown as DocumentNode<CreateProjectLinkMutationData, CreateProjectLinkMutationVariables>;
export const UpdateProjectLinkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProjectLink' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectLinkAttributes' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectLinkAttributes' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProjectLink' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'projectLinkAttributes' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectLinkAttributes' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectLink' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectLinkFieldsFragment' } },
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
  ],
} as unknown as DocumentNode<UpdateProjectLinkMutationData, UpdateProjectLinkMutationVariables>;
export const MoveProjectLinkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MoveProjectLink' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'destinationIndex' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'moveProjectLink' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'destinationIndex' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'destinationIndex' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'project' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFieldsFragment' } }],
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
} as unknown as DocumentNode<MoveProjectLinkMutationData, MoveProjectLinkMutationVariables>;
export const DeleteProjectLinkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProjectLink' },
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
            name: { kind: 'Name', value: 'deleteProjectLink' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
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
} as unknown as DocumentNode<DeleteProjectLinkMutationData, DeleteProjectLinkMutationVariables>;
