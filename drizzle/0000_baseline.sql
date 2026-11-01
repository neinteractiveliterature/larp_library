-- Baseline of the schema as created by the Rails app's migrations. Production already has all of this, so it must be
-- recorded as applied rather than run there; a fresh database (development, CI) runs it from scratch.
-- Drizzle can't express the extension or function below, so they're written by hand.
CREATE EXTENSION IF NOT EXISTS unaccent;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
  AS $$ SELECT public.unaccent('public.unaccent'::regdictionary, $1) $$;--> statement-breakpoint
CREATE TABLE "brand_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer,
	"user_id" integer,
	"admin" boolean,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"invitation_token" text,
	"invitation_email" text
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"creator_id" integer,
	"name_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english'::regconfig, f_unaccent(name))) STORED
);
--> statement-breakpoint
CREATE TABLE "project_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"url" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"filetype" varchar,
	"filesize" integer NOT NULL,
	"filepath" varchar NOT NULL,
	"uploader_id" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"position" integer
);
--> statement-breakpoint
CREATE TABLE "project_links" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"project_id" bigint NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL,
	"icon" text,
	"created_at" timestamp (6) NOT NULL,
	"updated_at" timestamp (6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"authors" text,
	"license" text,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"min_players" integer,
	"max_players" integer,
	"length_quantity" integer,
	"length_units" varchar,
	"publication_year" integer,
	"brand_id" integer,
	"min_facilitators" integer,
	"max_facilitators" integer,
	"title_for_ordering" text GENERATED ALWAYS AS (lower(regexp_replace(regexp_replace(regexp_replace(title, '^the\s+'::text, ''::text, 'i'::text), '^an?\s+'::text, ''::text, 'i'::text), '[^A-Za-z0-9]'::text, ''::text, 'g'::text))) STORED,
	"title_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english'::regconfig, f_unaccent(regexp_replace(regexp_replace(title, '^the\s+'::text, ''::text, 'i'::text), '^an?\s+'::text, ''::text, 'i'::text)))) STORED,
	"authors_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english'::regconfig, f_unaccent(authors))) STORED,
	"description_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english'::regconfig, f_unaccent(description))) STORED
);
--> statement-breakpoint
CREATE TABLE "projects_tags" (
	"project_id" integer,
	"tag_id" integer
);
--> statement-breakpoint
CREATE TABLE "tag_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"icon" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"tag_category_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"firstname" varchar,
	"lastname" varchar,
	"admin" boolean DEFAULT false,
	"sign_in_count" integer DEFAULT 0 NOT NULL,
	"current_sign_in_at" timestamp,
	"last_sign_in_at" timestamp,
	"current_sign_in_ip" varchar,
	"last_sign_in_ip" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"provider" varchar,
	"uid" varchar
);
--> statement-breakpoint
ALTER TABLE "brand_memberships" ADD CONSTRAINT "brand_memberships_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_memberships" ADD CONSTRAINT "brand_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_links" ADD CONSTRAINT "project_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_promotions" ADD CONSTRAINT "project_promotions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_category_id_tag_categories_id_fk" FOREIGN KEY ("tag_category_id") REFERENCES "public"."tag_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "index_brand_memberships_on_brand_id" ON "brand_memberships" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "index_brand_memberships_on_user_id" ON "brand_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "index_brand_memberships_on_brand_id_and_invitation_token" ON "brand_memberships" USING btree ("brand_id","invitation_token");--> statement-breakpoint
CREATE INDEX "idx_brands_name_vector" ON "brands" USING gin ("name_vector");--> statement-breakpoint
CREATE UNIQUE INDEX "index_brands_on_name" ON "brands" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "index_brands_on_slug" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "index_project_files_on_filepath" ON "project_files" USING btree ("filepath");--> statement-breakpoint
CREATE INDEX "index_project_files_on_project_id" ON "project_files" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "index_project_links_on_project_id" ON "project_links" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "index_project_promotions_on_project_id" ON "project_promotions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_projects_authors_vector" ON "projects" USING gin ("authors_vector");--> statement-breakpoint
CREATE INDEX "idx_projects_description_vector" ON "projects" USING gin ("description_vector");--> statement-breakpoint
CREATE INDEX "idx_projects_title_vector" ON "projects" USING gin ("title_vector");--> statement-breakpoint
CREATE INDEX "index_projects_on_brand_id" ON "projects" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "index_projects_tags_on_project_id" ON "projects_tags" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "index_projects_tags_on_tag_id" ON "projects_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "index_tag_categories_on_name" ON "tag_categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "index_tags_on_name" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "index_tags_on_tag_category_id" ON "tags" USING btree ("tag_category_id");