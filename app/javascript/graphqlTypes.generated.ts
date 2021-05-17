/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
};

export type Brand = {
  __typename: 'Brand';
  approved?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['ISO8601DateTime'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  projects: ProjectConnection;
  slug: Scalars['String'];
  updatedAt: Scalars['ISO8601DateTime'];
  users: Array<User>;
};


export type BrandProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for Brand. */
export type BrandConnection = {
  __typename: 'BrandConnection';
  /** A list of edges. */
  edges: Array<BrandEdge>;
  /** A list of nodes. */
  nodes: Array<Brand>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type BrandEdge = {
  __typename: 'BrandEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Brand>;
};

/** Autogenerated input type of CompleteProjectFileUpload */
export type CompleteProjectFileUploadInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  filepath: Scalars['String'];
  filesize: Scalars['Int'];
  filetype?: Maybe<Scalars['String']>;
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

/** Autogenerated return type of CompleteProjectFileUpload */
export type CompleteProjectFileUploadPayload = {
  __typename: 'CompleteProjectFileUploadPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  projectFile: ProjectFile;
};

/** Autogenerated input type of DeleteProjectFile */
export type DeleteProjectFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

/** Autogenerated return type of DeleteProjectFile */
export type DeleteProjectFilePayload = {
  __typename: 'DeleteProjectFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  projectFile: ProjectFile;
};

/** Autogenerated input type of DeleteProject */
export type DeleteProjectInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

/** Autogenerated return type of DeleteProject */
export type DeleteProjectPayload = {
  __typename: 'DeleteProjectPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  project: Project;
};


export type License = {
  __typename: 'License';
  dedicationHtml?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logoUrl: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename: 'Mutation';
  completeProjectFileUpload?: Maybe<CompleteProjectFileUploadPayload>;
  deleteProject?: Maybe<DeleteProjectPayload>;
  deleteProjectFile?: Maybe<DeleteProjectFilePayload>;
};


export type MutationCompleteProjectFileUploadArgs = {
  input: CompleteProjectFileUploadInput;
};


export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};


export type MutationDeleteProjectFileArgs = {
  input: DeleteProjectFileInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename: 'Project';
  authors?: Maybe<Scalars['String']>;
  brand: Brand;
  createdAt: Scalars['ISO8601DateTime'];
  currentUserCanDelete: Scalars['Boolean'];
  currentUserCanDeleteFiles: Scalars['Boolean'];
  currentUserCanEdit: Scalars['Boolean'];
  currentUserCanUploadFiles: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lengthQuantity?: Maybe<Scalars['Int']>;
  lengthUnits?: Maybe<Scalars['String']>;
  license?: Maybe<License>;
  maxPlayers?: Maybe<Scalars['Int']>;
  minPlayers?: Maybe<Scalars['Int']>;
  projectFiles: Array<ProjectFile>;
  publicationYear?: Maybe<Scalars['Int']>;
  tags: Array<Tag>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for Project. */
export type ProjectConnection = {
  __typename: 'ProjectConnection';
  /** A list of edges. */
  edges: Array<ProjectEdge>;
  /** A list of nodes. */
  nodes: Array<Project>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ProjectEdge = {
  __typename: 'ProjectEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Project>;
};

export type ProjectFile = {
  __typename: 'ProjectFile';
  createdAt: Scalars['ISO8601DateTime'];
  filename: Scalars['String'];
  filepath: Scalars['String'];
  filesize: Scalars['Int'];
  filetype?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  project: Project;
  updatedAt: Scalars['ISO8601DateTime'];
  uploaderId?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};

export type ProjectPromotion = {
  __typename: 'ProjectPromotion';
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  project: Project;
  updatedAt: Scalars['ISO8601DateTime'];
};

export type Query = {
  __typename: 'Query';
  brand: Brand;
  brands: BrandConnection;
  project: Project;
  projectPromotions: Array<ProjectPromotion>;
  projects: ProjectConnection;
  tagCategories: TagCategoryConnection;
  tags: TagConnection;
};


export type QueryBrandArgs = {
  id: Scalars['ID'];
};


export type QueryBrandsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  brandId?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  queryString?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};


export type QueryTagCategoriesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryTagsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  queryString?: Maybe<Scalars['String']>;
};

export type Tag = {
  __typename: 'Tag';
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  projects: ProjectConnection;
  tagCategory?: Maybe<TagCategory>;
  updatedAt: Scalars['ISO8601DateTime'];
};


export type TagProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type TagCategory = {
  __typename: 'TagCategory';
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['ISO8601DateTime'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  tags: Array<Tag>;
  textColor?: Maybe<Scalars['String']>;
  updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for TagCategory. */
export type TagCategoryConnection = {
  __typename: 'TagCategoryConnection';
  /** A list of edges. */
  edges: Array<TagCategoryEdge>;
  /** A list of nodes. */
  nodes: Array<TagCategory>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type TagCategoryEdge = {
  __typename: 'TagCategoryEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<TagCategory>;
};

/** The connection type for Tag. */
export type TagConnection = {
  __typename: 'TagConnection';
  /** A list of edges. */
  edges: Array<TagEdge>;
  /** A list of nodes. */
  nodes: Array<Tag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type TagEdge = {
  __typename: 'TagEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Tag>;
};

export type User = {
  __typename: 'User';
  admin?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastname?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};
