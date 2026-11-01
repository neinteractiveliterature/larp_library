import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  serial,
  bigserial,
  bigint,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// This schema was introspected from the Rails app's structure.sql (see drizzle/0000_baseline.sql), so the table, column
// and index names below match what Rails created. Rails-owned tables that the app doesn't use (ar_internal_metadata,
// schema_migrations, pg_search_documents) are deliberately left out and excluded via tablesFilter in drizzle.config.ts.

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

// ActiveRecord filled these in from Rails, so the columns had no defaults; they do now.
const timestamps = {
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// The users table doubles as better-auth's user table (see auth.server.ts). Rails' Devise columns it no longer reads
// (sign-in tracking, provider/uid) stay until cutover so the old app keeps working against the same database.
export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: varchar(),
  firstname: varchar(),
  lastname: varchar(),
  // Required by better-auth. Rails computed the name from firstname and lastname; here it's a real column, filled in by
  // the migration for existing users and from the Intercode profile for new ones.
  name: text().notNull().default(''),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  admin: boolean().default(false),
  signInCount: integer().default(0).notNull(),
  currentSignInAt: timestamp({ mode: 'date' }),
  lastSignInAt: timestamp({ mode: 'date' }),
  currentSignInIp: varchar(),
  lastSignInIp: varchar(),
  createdAt: timestamp({ mode: 'date' }),
  updatedAt: timestamp({ mode: 'date' }),
  provider: varchar(),
  uid: varchar(),
});

export const sessions = pgTable('sessions', {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text().notNull().unique(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Links a user to their identity at an OAuth provider. Intercode is the only provider: providerId is 'intercode' and
// accountId is the user's Intercode user id (what Rails kept in users.uid).
export const accounts = pgTable(
  'accounts',
  {
    id: serial().primaryKey(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerId: text().notNull(),
    accountId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ mode: 'date' }),
    refreshTokenExpiresAt: timestamp({ mode: 'date' }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('index_accounts_on_provider_id_and_account_id').on(table.providerId, table.accountId),
    index('index_accounts_on_user_id').on(table.userId),
  ],
);

export const verifications = pgTable('verifications', {
  id: serial().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const brands = pgTable(
  'brands',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    slug: text().notNull(),
    description: text(),
    ...timestamps,
    approved: boolean().default(false).notNull(),
    creatorId: integer(),
    nameVector: tsvector().generatedAlwaysAs(sql`to_tsvector('english'::regconfig, f_unaccent(name))`),
  },
  (table) => [
    index('idx_brands_name_vector').using('gin', table.nameVector),
    uniqueIndex('index_brands_on_name').on(table.name),
    uniqueIndex('index_brands_on_slug').on(table.slug),
  ],
);

export const brandMemberships = pgTable(
  'brand_memberships',
  {
    id: serial().primaryKey(),
    brandId: integer().references(() => brands.id),
    userId: integer().references(() => users.id),
    admin: boolean(),
    ...timestamps,
    invitationToken: text(),
    invitationEmail: text(),
  },
  (table) => [
    index('index_brand_memberships_on_brand_id').on(table.brandId),
    index('index_brand_memberships_on_user_id').on(table.userId),
    uniqueIndex('index_brand_memberships_on_brand_id_and_invitation_token').on(table.brandId, table.invitationToken),
  ],
);

export const tagCategories = pgTable(
  'tag_categories',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    color: text(),
    icon: text(),
    ...timestamps,
  },
  (table) => [uniqueIndex('index_tag_categories_on_name').on(table.name)],
);

export const tags = pgTable(
  'tags',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    ...timestamps,
    tagCategoryId: integer().references(() => tagCategories.id),
  },
  (table) => [
    index('index_tags_on_name').on(table.name),
    index('index_tags_on_tag_category_id').on(table.tagCategoryId),
  ],
);

export const projects = pgTable(
  'projects',
  {
    id: serial().primaryKey(),
    title: text(),
    authors: text(),
    license: text(),
    description: text(),
    ...timestamps,
    minPlayers: integer(),
    maxPlayers: integer(),
    lengthQuantity: integer(),
    lengthUnits: varchar(),
    publicationYear: integer(),
    brandId: integer(),
    minFacilitators: integer(),
    maxFacilitators: integer(),
    titleForOrdering: text().generatedAlwaysAs(
      sql`lower(regexp_replace(regexp_replace(regexp_replace(title, '^the\\s+'::text, ''::text, 'i'::text), '^an?\\s+'::text, ''::text, 'i'::text), '[^A-Za-z0-9]'::text, ''::text, 'g'::text))`,
    ),
    titleVector: tsvector().generatedAlwaysAs(
      sql`to_tsvector('english'::regconfig, f_unaccent(regexp_replace(regexp_replace(title, '^the\\s+'::text, ''::text, 'i'::text), '^an?\\s+'::text, ''::text, 'i'::text)))`,
    ),
    authorsVector: tsvector().generatedAlwaysAs(sql`to_tsvector('english'::regconfig, f_unaccent(authors))`),
    descriptionVector: tsvector().generatedAlwaysAs(sql`to_tsvector('english'::regconfig, f_unaccent(description))`),
  },
  (table) => [
    index('idx_projects_authors_vector').using('gin', table.authorsVector),
    index('idx_projects_description_vector').using('gin', table.descriptionVector),
    index('idx_projects_title_vector').using('gin', table.titleVector),
    index('index_projects_on_brand_id').on(table.brandId),
  ],
);

export const projectsTags = pgTable(
  'projects_tags',
  {
    projectId: integer(),
    tagId: integer(),
  },
  (table) => [
    index('index_projects_tags_on_project_id').on(table.projectId),
    index('index_projects_tags_on_tag_id').on(table.tagId),
  ],
);

export const projectFiles = pgTable(
  'project_files',
  {
    id: serial().primaryKey(),
    projectId: integer().references(() => projects.id),
    url: varchar().notNull(),
    filename: varchar().notNull(),
    filetype: varchar(),
    filesize: integer().notNull(),
    filepath: varchar().notNull(),
    uploaderId: integer().references(() => users.id),
    ...timestamps,
    position: integer(),
  },
  (table) => [
    uniqueIndex('index_project_files_on_filepath').on(table.filepath),
    index('index_project_files_on_project_id').on(table.projectId),
  ],
);

export const projectLinks = pgTable(
  'project_links',
  {
    id: bigserial({ mode: 'number' }).primaryKey(),
    projectId: bigint({ mode: 'number' })
      .notNull()
      .references(() => projects.id),
    url: text().notNull(),
    title: text().notNull(),
    position: integer().notNull(),
    icon: text(),
    createdAt: timestamp({ precision: 6, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ precision: 6, mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('index_project_links_on_project_id').on(table.projectId)],
);

export const projectPromotions = pgTable(
  'project_promotions',
  {
    id: serial().primaryKey(),
    projectId: integer()
      .notNull()
      .references(() => projects.id),
    ...timestamps,
  },
  (table) => [uniqueIndex('index_project_promotions_on_project_id').on(table.projectId)],
);

export const usersRelations = relations(users, ({ many }) => ({
  brandMemberships: many(brandMemberships),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  creator: one(users, { fields: [brands.creatorId], references: [users.id] }),
  brandMemberships: many(brandMemberships),
  projects: many(projects),
}));

export const brandMembershipsRelations = relations(brandMemberships, ({ one }) => ({
  brand: one(brands, { fields: [brandMemberships.brandId], references: [brands.id] }),
  user: one(users, { fields: [brandMemberships.userId], references: [users.id] }),
}));

export const tagCategoriesRelations = relations(tagCategories, ({ many }) => ({
  tags: many(tags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  tagCategory: one(tagCategories, { fields: [tags.tagCategoryId], references: [tagCategories.id] }),
  projectsTags: many(projectsTags),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  brand: one(brands, { fields: [projects.brandId], references: [brands.id] }),
  projectFiles: many(projectFiles),
  projectLinks: many(projectLinks),
  projectPromotion: one(projectPromotions),
  projectsTags: many(projectsTags),
}));

export const projectsTagsRelations = relations(projectsTags, ({ one }) => ({
  project: one(projects, { fields: [projectsTags.projectId], references: [projects.id] }),
  tag: one(tags, { fields: [projectsTags.tagId], references: [tags.id] }),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, { fields: [projectFiles.projectId], references: [projects.id] }),
  uploader: one(users, { fields: [projectFiles.uploaderId], references: [users.id] }),
}));

export const projectLinksRelations = relations(projectLinks, ({ one }) => ({
  project: one(projects, { fields: [projectLinks.projectId], references: [projects.id] }),
}));

export const projectPromotionsRelations = relations(projectPromotions, ({ one }) => ({
  project: one(projects, { fields: [projectPromotions.projectId], references: [projects.id] }),
}));
