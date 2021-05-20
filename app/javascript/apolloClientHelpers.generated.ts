import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type BrandKeySpecifier = ('approved' | 'createdAt' | 'creator' | 'currentUserCanCreateProjects' | 'currentUserCanEdit' | 'description' | 'id' | 'name' | 'projects' | 'slug' | 'updatedAt' | 'users' | BrandKeySpecifier)[];
export type BrandFieldPolicy = {
	approved?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanCreateProjects?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanEdit?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BrandConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | BrandConnectionKeySpecifier)[];
export type BrandConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BrandEdgeKeySpecifier = ('cursor' | 'node' | BrandEdgeKeySpecifier)[];
export type BrandEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CompleteProjectFileUploadPayloadKeySpecifier = ('clientMutationId' | 'projectFile' | CompleteProjectFileUploadPayloadKeySpecifier)[];
export type CompleteProjectFileUploadPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateProjectPayloadKeySpecifier = ('clientMutationId' | 'project' | CreateProjectPayloadKeySpecifier)[];
export type CreateProjectPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteProjectFilePayloadKeySpecifier = ('clientMutationId' | 'projectFile' | DeleteProjectFilePayloadKeySpecifier)[];
export type DeleteProjectFilePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteProjectPayloadKeySpecifier = ('clientMutationId' | 'project' | DeleteProjectPayloadKeySpecifier)[];
export type DeleteProjectPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseKeySpecifier = ('dedicationHtml' | 'discouraged' | 'discouragedReason' | 'id' | 'logoUrl' | 'name' | 'url' | LicenseKeySpecifier)[];
export type LicenseFieldPolicy = {
	dedicationHtml?: FieldPolicy<any> | FieldReadFunction<any>,
	discouraged?: FieldPolicy<any> | FieldReadFunction<any>,
	discouragedReason?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	logoUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('completeProjectFileUpload' | 'createProject' | 'deleteProject' | 'deleteProjectFile' | 'updateProject' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	completeProjectFileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	createProject?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProject?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProjectFile?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectKeySpecifier = ('authors' | 'brand' | 'createdAt' | 'currentUserCanDelete' | 'currentUserCanDeleteFiles' | 'currentUserCanEdit' | 'currentUserCanUploadFiles' | 'description' | 'id' | 'lengthQuantity' | 'lengthUnits' | 'license' | 'maxPlayers' | 'minPlayers' | 'projectFiles' | 'publicationYear' | 'tags' | 'title' | 'updatedAt' | ProjectKeySpecifier)[];
export type ProjectFieldPolicy = {
	authors?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanDeleteFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanEdit?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUserCanUploadFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lengthQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	lengthUnits?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	maxPlayers?: FieldPolicy<any> | FieldReadFunction<any>,
	minPlayers?: FieldPolicy<any> | FieldReadFunction<any>,
	projectFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationYear?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProjectConnectionKeySpecifier)[];
export type ProjectConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectEdgeKeySpecifier = ('cursor' | 'node' | ProjectEdgeKeySpecifier)[];
export type ProjectEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectFileKeySpecifier = ('createdAt' | 'filename' | 'filepath' | 'filesize' | 'filetype' | 'id' | 'project' | 'updatedAt' | 'uploaderId' | 'url' | ProjectFileKeySpecifier)[];
export type ProjectFileFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	filename?: FieldPolicy<any> | FieldReadFunction<any>,
	filepath?: FieldPolicy<any> | FieldReadFunction<any>,
	filesize?: FieldPolicy<any> | FieldReadFunction<any>,
	filetype?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaderId?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectPromotionKeySpecifier = ('createdAt' | 'id' | 'project' | 'updatedAt' | ProjectPromotionKeySpecifier)[];
export type ProjectPromotionFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('brand' | 'brands' | 'licenses' | 'project' | 'projectPromotions' | 'projects' | 'tagCategories' | 'tags' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	brands?: FieldPolicy<any> | FieldReadFunction<any>,
	licenses?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	projectPromotions?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	tagCategories?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagKeySpecifier = ('createdAt' | 'id' | 'name' | 'projects' | 'tagCategory' | 'updatedAt' | TagKeySpecifier)[];
export type TagFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	tagCategory?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagCategoryKeySpecifier = ('color' | 'createdAt' | 'icon' | 'id' | 'name' | 'tags' | 'textColor' | 'updatedAt' | TagCategoryKeySpecifier)[];
export type TagCategoryFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	textColor?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagCategoryConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TagCategoryConnectionKeySpecifier)[];
export type TagCategoryConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagCategoryEdgeKeySpecifier = ('cursor' | 'node' | TagCategoryEdgeKeySpecifier)[];
export type TagCategoryEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TagConnectionKeySpecifier)[];
export type TagConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagEdgeKeySpecifier = ('cursor' | 'node' | TagEdgeKeySpecifier)[];
export type TagEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateProjectPayloadKeySpecifier = ('clientMutationId' | 'project' | UpdateProjectPayloadKeySpecifier)[];
export type UpdateProjectPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('admin' | 'email' | 'firstname' | 'id' | 'lastname' | 'username' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	admin?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstname?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lastname?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	Brand?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BrandKeySpecifier | (() => undefined | BrandKeySpecifier),
		fields?: BrandFieldPolicy,
	},
	BrandConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BrandConnectionKeySpecifier | (() => undefined | BrandConnectionKeySpecifier),
		fields?: BrandConnectionFieldPolicy,
	},
	BrandEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BrandEdgeKeySpecifier | (() => undefined | BrandEdgeKeySpecifier),
		fields?: BrandEdgeFieldPolicy,
	},
	CompleteProjectFileUploadPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CompleteProjectFileUploadPayloadKeySpecifier | (() => undefined | CompleteProjectFileUploadPayloadKeySpecifier),
		fields?: CompleteProjectFileUploadPayloadFieldPolicy,
	},
	CreateProjectPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateProjectPayloadKeySpecifier | (() => undefined | CreateProjectPayloadKeySpecifier),
		fields?: CreateProjectPayloadFieldPolicy,
	},
	DeleteProjectFilePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteProjectFilePayloadKeySpecifier | (() => undefined | DeleteProjectFilePayloadKeySpecifier),
		fields?: DeleteProjectFilePayloadFieldPolicy,
	},
	DeleteProjectPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteProjectPayloadKeySpecifier | (() => undefined | DeleteProjectPayloadKeySpecifier),
		fields?: DeleteProjectPayloadFieldPolicy,
	},
	License?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseKeySpecifier | (() => undefined | LicenseKeySpecifier),
		fields?: LicenseFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	Project?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectKeySpecifier | (() => undefined | ProjectKeySpecifier),
		fields?: ProjectFieldPolicy,
	},
	ProjectConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectConnectionKeySpecifier | (() => undefined | ProjectConnectionKeySpecifier),
		fields?: ProjectConnectionFieldPolicy,
	},
	ProjectEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectEdgeKeySpecifier | (() => undefined | ProjectEdgeKeySpecifier),
		fields?: ProjectEdgeFieldPolicy,
	},
	ProjectFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectFileKeySpecifier | (() => undefined | ProjectFileKeySpecifier),
		fields?: ProjectFileFieldPolicy,
	},
	ProjectPromotion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectPromotionKeySpecifier | (() => undefined | ProjectPromotionKeySpecifier),
		fields?: ProjectPromotionFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Tag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagKeySpecifier | (() => undefined | TagKeySpecifier),
		fields?: TagFieldPolicy,
	},
	TagCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagCategoryKeySpecifier | (() => undefined | TagCategoryKeySpecifier),
		fields?: TagCategoryFieldPolicy,
	},
	TagCategoryConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagCategoryConnectionKeySpecifier | (() => undefined | TagCategoryConnectionKeySpecifier),
		fields?: TagCategoryConnectionFieldPolicy,
	},
	TagCategoryEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagCategoryEdgeKeySpecifier | (() => undefined | TagCategoryEdgeKeySpecifier),
		fields?: TagCategoryEdgeFieldPolicy,
	},
	TagConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagConnectionKeySpecifier | (() => undefined | TagConnectionKeySpecifier),
		fields?: TagConnectionFieldPolicy,
	},
	TagEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagEdgeKeySpecifier | (() => undefined | TagEdgeKeySpecifier),
		fields?: TagEdgeFieldPolicy,
	},
	UpdateProjectPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateProjectPayloadKeySpecifier | (() => undefined | UpdateProjectPayloadKeySpecifier),
		fields?: UpdateProjectPayloadFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};