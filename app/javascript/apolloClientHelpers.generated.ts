import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type BrandKeySpecifier = ('approved' | 'createdAt' | 'creator' | 'description' | 'id' | 'name' | 'projects' | 'slug' | 'updatedAt' | 'users' | BrandKeySpecifier)[];
export type BrandFieldPolicy = {
	approved?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BrandConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | BrandConnectionKeySpecifier)[];
export type BrandConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type DeleteProjectFilePayloadKeySpecifier = ('clientMutationId' | 'projectFile' | DeleteProjectFilePayloadKeySpecifier)[];
export type DeleteProjectFilePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseKeySpecifier = ('id' | 'logoUrl' | 'name' | 'url' | LicenseKeySpecifier)[];
export type LicenseFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	logoUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('completeProjectFileUpload' | 'deleteProjectFile' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	completeProjectFileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProjectFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectKeySpecifier = ('authors' | 'brand' | 'createdAt' | 'description' | 'id' | 'lengthQuantity' | 'lengthUnits' | 'license' | 'maxPlayers' | 'minPlayers' | 'projectFiles' | 'publicationYear' | 'tags' | 'title' | 'updatedAt' | ProjectKeySpecifier)[];
export type ProjectFieldPolicy = {
	authors?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type ProjectConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | ProjectConnectionKeySpecifier)[];
export type ProjectConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type QueryKeySpecifier = ('brand' | 'brands' | 'project' | 'projects' | 'tags' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	brands?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type TagConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | TagConnectionKeySpecifier)[];
export type TagConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TagEdgeKeySpecifier = ('cursor' | 'node' | TagEdgeKeySpecifier)[];
export type TagEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
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
	DeleteProjectFilePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteProjectFilePayloadKeySpecifier | (() => undefined | DeleteProjectFilePayloadKeySpecifier),
		fields?: DeleteProjectFilePayloadFieldPolicy,
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
	TagConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagConnectionKeySpecifier | (() => undefined | TagConnectionKeySpecifier),
		fields?: TagConnectionFieldPolicy,
	},
	TagEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TagEdgeKeySpecifier | (() => undefined | TagEdgeKeySpecifier),
		fields?: TagEdgeFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};