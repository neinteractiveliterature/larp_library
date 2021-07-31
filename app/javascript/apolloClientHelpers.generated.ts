import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type AbilityKeySpecifier = (
  | 'canCreateProjectPromotions'
  | 'canUpdateTagCategories'
  | 'canUpdateTags'
  | AbilityKeySpecifier
)[];
export type AbilityFieldPolicy = {
  canCreateProjectPromotions?: FieldPolicy<any> | FieldReadFunction<any>;
  canUpdateTagCategories?: FieldPolicy<any> | FieldReadFunction<any>;
  canUpdateTags?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AcceptBrandMembershipInvitationPayloadKeySpecifier = (
  | 'brandMembership'
  | 'clientMutationId'
  | AcceptBrandMembershipInvitationPayloadKeySpecifier
)[];
export type AcceptBrandMembershipInvitationPayloadFieldPolicy = {
  brandMembership?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ApproveBrandPayloadKeySpecifier = (
  | 'brand'
  | 'clientMutationId'
  | ApproveBrandPayloadKeySpecifier
)[];
export type ApproveBrandPayloadFieldPolicy = {
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BrandKeySpecifier = (
  | 'approved'
  | 'brandMemberships'
  | 'createdAt'
  | 'creator'
  | 'currentUserCanCreateProjects'
  | 'currentUserCanEdit'
  | 'currentUserCanManageMemberships'
  | 'description'
  | 'id'
  | 'name'
  | 'projects'
  | 'slug'
  | 'updatedAt'
  | 'users'
  | BrandKeySpecifier
)[];
export type BrandFieldPolicy = {
  approved?: FieldPolicy<any> | FieldReadFunction<any>;
  brandMemberships?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  creator?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanCreateProjects?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanEdit?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanManageMemberships?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  projects?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  users?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BrandConnectionKeySpecifier = (
  | 'edges'
  | 'pageInfo'
  | 'totalCount'
  | BrandConnectionKeySpecifier
)[];
export type BrandConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BrandEdgeKeySpecifier = ('cursor' | 'node' | BrandEdgeKeySpecifier)[];
export type BrandEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BrandMembershipKeySpecifier = (
  | 'admin'
  | 'brand'
  | 'createdAt'
  | 'id'
  | 'invitationEmail'
  | 'updatedAt'
  | 'user'
  | BrandMembershipKeySpecifier
)[];
export type BrandMembershipFieldPolicy = {
  admin?: FieldPolicy<any> | FieldReadFunction<any>;
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  invitationEmail?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CompleteProjectFileUploadPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectFile'
  | CompleteProjectFileUploadPayloadKeySpecifier
)[];
export type CompleteProjectFileUploadPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectFile?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CreateBrandPayloadKeySpecifier = (
  | 'brand'
  | 'clientMutationId'
  | CreateBrandPayloadKeySpecifier
)[];
export type CreateBrandPayloadFieldPolicy = {
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CreateProjectLinkPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectLink'
  | CreateProjectLinkPayloadKeySpecifier
)[];
export type CreateProjectLinkPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectLink?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CreateProjectPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'project'
  | CreateProjectPayloadKeySpecifier
)[];
export type CreateProjectPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CreateTagCategoryPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tagCategory'
  | CreateTagCategoryPayloadKeySpecifier
)[];
export type CreateTagCategoryPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CreateTagPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tag'
  | CreateTagPayloadKeySpecifier
)[];
export type CreateTagPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tag?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteBrandMembershipPayloadKeySpecifier = (
  | 'brandMembership'
  | 'clientMutationId'
  | DeleteBrandMembershipPayloadKeySpecifier
)[];
export type DeleteBrandMembershipPayloadFieldPolicy = {
  brandMembership?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteProjectFilePayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectFile'
  | DeleteProjectFilePayloadKeySpecifier
)[];
export type DeleteProjectFilePayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectFile?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteProjectLinkPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectLink'
  | DeleteProjectLinkPayloadKeySpecifier
)[];
export type DeleteProjectLinkPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectLink?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteProjectPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'project'
  | DeleteProjectPayloadKeySpecifier
)[];
export type DeleteProjectPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteTagCategoryPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tagCategory'
  | DeleteTagCategoryPayloadKeySpecifier
)[];
export type DeleteTagCategoryPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DeleteTagPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tag'
  | DeleteTagPayloadKeySpecifier
)[];
export type DeleteTagPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tag?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type InviteBrandMemberPayloadKeySpecifier = (
  | 'brandMembership'
  | 'clientMutationId'
  | InviteBrandMemberPayloadKeySpecifier
)[];
export type InviteBrandMemberPayloadFieldPolicy = {
  brandMembership?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LicenseKeySpecifier = (
  | 'dedicationHtml'
  | 'discouraged'
  | 'discouragedReason'
  | 'id'
  | 'logoUrl'
  | 'name'
  | 'url'
  | LicenseKeySpecifier
)[];
export type LicenseFieldPolicy = {
  dedicationHtml?: FieldPolicy<any> | FieldReadFunction<any>;
  discouraged?: FieldPolicy<any> | FieldReadFunction<any>;
  discouragedReason?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  logoUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
  | 'acceptBrandMembershipInvitation'
  | 'approveBrand'
  | 'completeProjectFileUpload'
  | 'createBrand'
  | 'createProject'
  | 'createProjectLink'
  | 'createTag'
  | 'createTagCategory'
  | 'deleteBrandMembership'
  | 'deleteProject'
  | 'deleteProjectFile'
  | 'deleteProjectLink'
  | 'deleteTag'
  | 'deleteTagCategory'
  | 'inviteBrandMember'
  | 'promoteProject'
  | 'unpromoteProject'
  | 'updateBrand'
  | 'updateProject'
  | 'updateProjectLink'
  | 'updateTag'
  | 'updateTagCategory'
  | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
  acceptBrandMembershipInvitation?: FieldPolicy<any> | FieldReadFunction<any>;
  approveBrand?: FieldPolicy<any> | FieldReadFunction<any>;
  completeProjectFileUpload?: FieldPolicy<any> | FieldReadFunction<any>;
  createBrand?: FieldPolicy<any> | FieldReadFunction<any>;
  createProject?: FieldPolicy<any> | FieldReadFunction<any>;
  createProjectLink?: FieldPolicy<any> | FieldReadFunction<any>;
  createTag?: FieldPolicy<any> | FieldReadFunction<any>;
  createTagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteBrandMembership?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteProject?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteProjectFile?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteProjectLink?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteTag?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteTagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
  inviteBrandMember?: FieldPolicy<any> | FieldReadFunction<any>;
  promoteProject?: FieldPolicy<any> | FieldReadFunction<any>;
  unpromoteProject?: FieldPolicy<any> | FieldReadFunction<any>;
  updateBrand?: FieldPolicy<any> | FieldReadFunction<any>;
  updateProject?: FieldPolicy<any> | FieldReadFunction<any>;
  updateProjectLink?: FieldPolicy<any> | FieldReadFunction<any>;
  updateTag?: FieldPolicy<any> | FieldReadFunction<any>;
  updateTagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PageInfoKeySpecifier = (
  | 'endCursor'
  | 'hasNextPage'
  | 'hasPreviousPage'
  | 'startCursor'
  | PageInfoKeySpecifier
)[];
export type PageInfoFieldPolicy = {
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>;
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>;
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>;
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectKeySpecifier = (
  | 'authors'
  | 'brand'
  | 'createdAt'
  | 'currentUserCanDelete'
  | 'currentUserCanDeleteFiles'
  | 'currentUserCanEdit'
  | 'currentUserCanUploadFiles'
  | 'description'
  | 'id'
  | 'lengthQuantity'
  | 'lengthUnits'
  | 'license'
  | 'maxFacilitators'
  | 'maxPlayers'
  | 'minFacilitators'
  | 'minPlayers'
  | 'projectFiles'
  | 'projectLinks'
  | 'publicationYear'
  | 'tags'
  | 'title'
  | 'updatedAt'
  | ProjectKeySpecifier
)[];
export type ProjectFieldPolicy = {
  authors?: FieldPolicy<any> | FieldReadFunction<any>;
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanDeleteFiles?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanEdit?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUserCanUploadFiles?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  lengthQuantity?: FieldPolicy<any> | FieldReadFunction<any>;
  lengthUnits?: FieldPolicy<any> | FieldReadFunction<any>;
  license?: FieldPolicy<any> | FieldReadFunction<any>;
  maxFacilitators?: FieldPolicy<any> | FieldReadFunction<any>;
  maxPlayers?: FieldPolicy<any> | FieldReadFunction<any>;
  minFacilitators?: FieldPolicy<any> | FieldReadFunction<any>;
  minPlayers?: FieldPolicy<any> | FieldReadFunction<any>;
  projectFiles?: FieldPolicy<any> | FieldReadFunction<any>;
  projectLinks?: FieldPolicy<any> | FieldReadFunction<any>;
  publicationYear?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectConnectionKeySpecifier = (
  | 'edges'
  | 'pageInfo'
  | 'totalCount'
  | ProjectConnectionKeySpecifier
)[];
export type ProjectConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectEdgeKeySpecifier = ('cursor' | 'node' | ProjectEdgeKeySpecifier)[];
export type ProjectEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectFileKeySpecifier = (
  | 'createdAt'
  | 'filename'
  | 'filepath'
  | 'filesize'
  | 'filetype'
  | 'id'
  | 'project'
  | 'updatedAt'
  | 'uploaderId'
  | 'url'
  | ProjectFileKeySpecifier
)[];
export type ProjectFileFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  filename?: FieldPolicy<any> | FieldReadFunction<any>;
  filepath?: FieldPolicy<any> | FieldReadFunction<any>;
  filesize?: FieldPolicy<any> | FieldReadFunction<any>;
  filetype?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  uploaderId?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectLinkKeySpecifier = (
  | 'icon'
  | 'id'
  | 'position'
  | 'project'
  | 'title'
  | 'url'
  | ProjectLinkKeySpecifier
)[];
export type ProjectLinkFieldPolicy = {
  icon?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  position?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectPromotionKeySpecifier = (
  | 'createdAt'
  | 'id'
  | 'project'
  | 'updatedAt'
  | ProjectPromotionKeySpecifier
)[];
export type ProjectPromotionFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PromoteProjectPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectPromotion'
  | PromoteProjectPayloadKeySpecifier
)[];
export type PromoteProjectPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectPromotion?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
  | 'brand'
  | 'brandMembership'
  | 'brands'
  | 'currentAbility'
  | 'currentUser'
  | 'licenses'
  | 'project'
  | 'projectPromotions'
  | 'projects'
  | 'tag'
  | 'tagByName'
  | 'tagCategories'
  | 'tagCategory'
  | 'tags'
  | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  brandMembership?: FieldPolicy<any> | FieldReadFunction<any>;
  brands?: FieldPolicy<any> | FieldReadFunction<any>;
  currentAbility?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUser?: FieldPolicy<any> | FieldReadFunction<any>;
  licenses?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
  projectPromotions?: FieldPolicy<any> | FieldReadFunction<any>;
  projects?: FieldPolicy<any> | FieldReadFunction<any>;
  tag?: FieldPolicy<any> | FieldReadFunction<any>;
  tagByName?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategories?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagKeySpecifier = (
  | 'createdAt'
  | 'id'
  | 'name'
  | 'projects'
  | 'tagCategory'
  | 'updatedAt'
  | TagKeySpecifier
)[];
export type TagFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  projects?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagCategoryKeySpecifier = (
  | 'color'
  | 'createdAt'
  | 'icon'
  | 'id'
  | 'name'
  | 'tags'
  | 'textColor'
  | 'updatedAt'
  | TagCategoryKeySpecifier
)[];
export type TagCategoryFieldPolicy = {
  color?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  icon?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
  textColor?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagCategoryConnectionKeySpecifier = (
  | 'edges'
  | 'pageInfo'
  | 'totalCount'
  | TagCategoryConnectionKeySpecifier
)[];
export type TagCategoryConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagCategoryEdgeKeySpecifier = ('cursor' | 'node' | TagCategoryEdgeKeySpecifier)[];
export type TagCategoryEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagConnectionKeySpecifier = (
  | 'edges'
  | 'pageInfo'
  | 'totalCount'
  | TagConnectionKeySpecifier
)[];
export type TagConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TagEdgeKeySpecifier = ('cursor' | 'node' | TagEdgeKeySpecifier)[];
export type TagEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UnpromoteProjectPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectPromotion'
  | UnpromoteProjectPayloadKeySpecifier
)[];
export type UnpromoteProjectPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectPromotion?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UpdateBrandPayloadKeySpecifier = (
  | 'brand'
  | 'clientMutationId'
  | UpdateBrandPayloadKeySpecifier
)[];
export type UpdateBrandPayloadFieldPolicy = {
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UpdateProjectLinkPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'projectLink'
  | UpdateProjectLinkPayloadKeySpecifier
)[];
export type UpdateProjectLinkPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  projectLink?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UpdateProjectPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'project'
  | UpdateProjectPayloadKeySpecifier
)[];
export type UpdateProjectPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  project?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UpdateTagCategoryPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tagCategory'
  | UpdateTagCategoryPayloadKeySpecifier
)[];
export type UpdateTagCategoryPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tagCategory?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UpdateTagPayloadKeySpecifier = (
  | 'clientMutationId'
  | 'tag'
  | UpdateTagPayloadKeySpecifier
)[];
export type UpdateTagPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>;
  tag?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserKeySpecifier = (
  | 'admin'
  | 'brandMemberships'
  | 'brands'
  | 'email'
  | 'firstname'
  | 'id'
  | 'lastname'
  | 'name'
  | 'username'
  | UserKeySpecifier
)[];
export type UserFieldPolicy = {
  admin?: FieldPolicy<any> | FieldReadFunction<any>;
  brandMemberships?: FieldPolicy<any> | FieldReadFunction<any>;
  brands?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  firstname?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  lastname?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TypedTypePolicies = TypePolicies & {
  Ability?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | AbilityKeySpecifier | (() => undefined | AbilityKeySpecifier);
    fields?: AbilityFieldPolicy;
  };
  AcceptBrandMembershipInvitationPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | AcceptBrandMembershipInvitationPayloadKeySpecifier
      | (() => undefined | AcceptBrandMembershipInvitationPayloadKeySpecifier);
    fields?: AcceptBrandMembershipInvitationPayloadFieldPolicy;
  };
  ApproveBrandPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ApproveBrandPayloadKeySpecifier
      | (() => undefined | ApproveBrandPayloadKeySpecifier);
    fields?: ApproveBrandPayloadFieldPolicy;
  };
  Brand?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | BrandKeySpecifier | (() => undefined | BrandKeySpecifier);
    fields?: BrandFieldPolicy;
  };
  BrandConnection?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BrandConnectionKeySpecifier
      | (() => undefined | BrandConnectionKeySpecifier);
    fields?: BrandConnectionFieldPolicy;
  };
  BrandEdge?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | BrandEdgeKeySpecifier | (() => undefined | BrandEdgeKeySpecifier);
    fields?: BrandEdgeFieldPolicy;
  };
  BrandMembership?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BrandMembershipKeySpecifier
      | (() => undefined | BrandMembershipKeySpecifier);
    fields?: BrandMembershipFieldPolicy;
  };
  CompleteProjectFileUploadPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CompleteProjectFileUploadPayloadKeySpecifier
      | (() => undefined | CompleteProjectFileUploadPayloadKeySpecifier);
    fields?: CompleteProjectFileUploadPayloadFieldPolicy;
  };
  CreateBrandPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CreateBrandPayloadKeySpecifier
      | (() => undefined | CreateBrandPayloadKeySpecifier);
    fields?: CreateBrandPayloadFieldPolicy;
  };
  CreateProjectLinkPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CreateProjectLinkPayloadKeySpecifier
      | (() => undefined | CreateProjectLinkPayloadKeySpecifier);
    fields?: CreateProjectLinkPayloadFieldPolicy;
  };
  CreateProjectPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CreateProjectPayloadKeySpecifier
      | (() => undefined | CreateProjectPayloadKeySpecifier);
    fields?: CreateProjectPayloadFieldPolicy;
  };
  CreateTagCategoryPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CreateTagCategoryPayloadKeySpecifier
      | (() => undefined | CreateTagCategoryPayloadKeySpecifier);
    fields?: CreateTagCategoryPayloadFieldPolicy;
  };
  CreateTagPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CreateTagPayloadKeySpecifier
      | (() => undefined | CreateTagPayloadKeySpecifier);
    fields?: CreateTagPayloadFieldPolicy;
  };
  DeleteBrandMembershipPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteBrandMembershipPayloadKeySpecifier
      | (() => undefined | DeleteBrandMembershipPayloadKeySpecifier);
    fields?: DeleteBrandMembershipPayloadFieldPolicy;
  };
  DeleteProjectFilePayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteProjectFilePayloadKeySpecifier
      | (() => undefined | DeleteProjectFilePayloadKeySpecifier);
    fields?: DeleteProjectFilePayloadFieldPolicy;
  };
  DeleteProjectLinkPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteProjectLinkPayloadKeySpecifier
      | (() => undefined | DeleteProjectLinkPayloadKeySpecifier);
    fields?: DeleteProjectLinkPayloadFieldPolicy;
  };
  DeleteProjectPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteProjectPayloadKeySpecifier
      | (() => undefined | DeleteProjectPayloadKeySpecifier);
    fields?: DeleteProjectPayloadFieldPolicy;
  };
  DeleteTagCategoryPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteTagCategoryPayloadKeySpecifier
      | (() => undefined | DeleteTagCategoryPayloadKeySpecifier);
    fields?: DeleteTagCategoryPayloadFieldPolicy;
  };
  DeleteTagPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | DeleteTagPayloadKeySpecifier
      | (() => undefined | DeleteTagPayloadKeySpecifier);
    fields?: DeleteTagPayloadFieldPolicy;
  };
  InviteBrandMemberPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | InviteBrandMemberPayloadKeySpecifier
      | (() => undefined | InviteBrandMemberPayloadKeySpecifier);
    fields?: InviteBrandMemberPayloadFieldPolicy;
  };
  License?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | LicenseKeySpecifier | (() => undefined | LicenseKeySpecifier);
    fields?: LicenseFieldPolicy;
  };
  Mutation?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier);
    fields?: MutationFieldPolicy;
  };
  PageInfo?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier);
    fields?: PageInfoFieldPolicy;
  };
  Project?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | ProjectKeySpecifier | (() => undefined | ProjectKeySpecifier);
    fields?: ProjectFieldPolicy;
  };
  ProjectConnection?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ProjectConnectionKeySpecifier
      | (() => undefined | ProjectConnectionKeySpecifier);
    fields?: ProjectConnectionFieldPolicy;
  };
  ProjectEdge?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | ProjectEdgeKeySpecifier | (() => undefined | ProjectEdgeKeySpecifier);
    fields?: ProjectEdgeFieldPolicy;
  };
  ProjectFile?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | ProjectFileKeySpecifier | (() => undefined | ProjectFileKeySpecifier);
    fields?: ProjectFileFieldPolicy;
  };
  ProjectLink?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | ProjectLinkKeySpecifier | (() => undefined | ProjectLinkKeySpecifier);
    fields?: ProjectLinkFieldPolicy;
  };
  ProjectPromotion?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ProjectPromotionKeySpecifier
      | (() => undefined | ProjectPromotionKeySpecifier);
    fields?: ProjectPromotionFieldPolicy;
  };
  PromoteProjectPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | PromoteProjectPayloadKeySpecifier
      | (() => undefined | PromoteProjectPayloadKeySpecifier);
    fields?: PromoteProjectPayloadFieldPolicy;
  };
  Query?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier);
    fields?: QueryFieldPolicy;
  };
  Tag?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | TagKeySpecifier | (() => undefined | TagKeySpecifier);
    fields?: TagFieldPolicy;
  };
  TagCategory?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | TagCategoryKeySpecifier | (() => undefined | TagCategoryKeySpecifier);
    fields?: TagCategoryFieldPolicy;
  };
  TagCategoryConnection?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | TagCategoryConnectionKeySpecifier
      | (() => undefined | TagCategoryConnectionKeySpecifier);
    fields?: TagCategoryConnectionFieldPolicy;
  };
  TagCategoryEdge?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | TagCategoryEdgeKeySpecifier
      | (() => undefined | TagCategoryEdgeKeySpecifier);
    fields?: TagCategoryEdgeFieldPolicy;
  };
  TagConnection?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | TagConnectionKeySpecifier | (() => undefined | TagConnectionKeySpecifier);
    fields?: TagConnectionFieldPolicy;
  };
  TagEdge?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | TagEdgeKeySpecifier | (() => undefined | TagEdgeKeySpecifier);
    fields?: TagEdgeFieldPolicy;
  };
  UnpromoteProjectPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UnpromoteProjectPayloadKeySpecifier
      | (() => undefined | UnpromoteProjectPayloadKeySpecifier);
    fields?: UnpromoteProjectPayloadFieldPolicy;
  };
  UpdateBrandPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UpdateBrandPayloadKeySpecifier
      | (() => undefined | UpdateBrandPayloadKeySpecifier);
    fields?: UpdateBrandPayloadFieldPolicy;
  };
  UpdateProjectLinkPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UpdateProjectLinkPayloadKeySpecifier
      | (() => undefined | UpdateProjectLinkPayloadKeySpecifier);
    fields?: UpdateProjectLinkPayloadFieldPolicy;
  };
  UpdateProjectPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UpdateProjectPayloadKeySpecifier
      | (() => undefined | UpdateProjectPayloadKeySpecifier);
    fields?: UpdateProjectPayloadFieldPolicy;
  };
  UpdateTagCategoryPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UpdateTagCategoryPayloadKeySpecifier
      | (() => undefined | UpdateTagCategoryPayloadKeySpecifier);
    fields?: UpdateTagCategoryPayloadFieldPolicy;
  };
  UpdateTagPayload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | UpdateTagPayloadKeySpecifier
      | (() => undefined | UpdateTagPayloadKeySpecifier);
    fields?: UpdateTagPayloadFieldPolicy;
  };
  User?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
    fields?: UserFieldPolicy;
  };
};
