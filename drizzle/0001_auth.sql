CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "index_accounts_on_provider_id_and_account_id" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "index_accounts_on_user_id" ON "accounts" USING btree ("user_id");--> statement-breakpoint
-- Data backfill for users who signed in through the Rails app (Devise + the Intercode OmniAuth strategy).
-- Rails computed User#name as "#{firstname} #{lastname}".
UPDATE "users" SET "name" = btrim(coalesce("firstname", '') || ' ' || coalesce("lastname", ''));--> statement-breakpoint
-- Intercode only hands out accounts with a confirmed email address.
UPDATE "users" SET "email_verified" = true WHERE "email" IS NOT NULL;--> statement-breakpoint
-- One accounts row per existing user, keyed the way better-auth keys Intercode sign-ins (providerId + Intercode user id,
-- which is what Rails stored in users.provider and users.uid), so everyone keeps their existing user row when they
-- sign in again.
INSERT INTO "accounts" ("user_id", "provider_id", "account_id", "created_at", "updated_at")
SELECT "id", "provider", "uid", coalesce("created_at", now()), coalesce("updated_at", now())
FROM "users"
WHERE "provider" IS NOT NULL AND "uid" IS NOT NULL;
