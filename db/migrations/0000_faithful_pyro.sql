CREATE TYPE "public"."flag_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TYPE "public"."thing_status" AS ENUM('published', 'pending', 'removed');--> statement-breakpoint
CREATE TYPE "public"."subject_type" AS ENUM('thing', 'comment');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"thing_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"parent_id" integer,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "one_level_replies" CHECK ("comments"."parent_id" IS NULL OR (SELECT parent_id FROM comments c2 WHERE c2.id = "comments"."parent_id") IS NULL)
);
--> statement-breakpoint
CREATE TABLE "moderation_flags" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_type" "subject_type" NOT NULL,
	"subject_id" integer NOT NULL,
	"reason" text NOT NULL,
	"reporter_id" integer,
	"resolved_by" integer,
	"status" "flag_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "parks" (
	"id" serial PRIMARY KEY NOT NULL,
	"cms_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"states" text[],
	"summary" text,
	"hero_url" text,
	"lat" numeric,
	"lng" numeric,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parks_cms_id_unique" UNIQUE("cms_id"),
	CONSTRAINT "parks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "thing_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"thing_id" integer NOT NULL,
	"url" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "things" (
	"id" serial PRIMARY KEY NOT NULL,
	"park_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"status" "thing_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"roles" text[] DEFAULT '{"user"}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject_type" "subject_type" NOT NULL,
	"subject_id" integer NOT NULL,
	"value" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_user_subject_unique" UNIQUE("user_id","subject_type","subject_id"),
	CONSTRAINT "votes_value_check" CHECK ("votes"."value" IN (-1, 1))
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_thing_id_things_id_fk" FOREIGN KEY ("thing_id") REFERENCES "public"."things"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_flags" ADD CONSTRAINT "moderation_flags_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_flags" ADD CONSTRAINT "moderation_flags_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thing_images" ADD CONSTRAINT "thing_images_thing_id_things_id_fk" FOREIGN KEY ("thing_id") REFERENCES "public"."things"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "things" ADD CONSTRAINT "things_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "things" ADD CONSTRAINT "things_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "things" ADD CONSTRAINT "things_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "comments_thing_created_idx" ON "comments" USING btree ("thing_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "moderation_flags_status_created_idx" ON "moderation_flags" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "moderation_flags_subject_idx" ON "moderation_flags" USING btree ("subject_type","subject_id");--> statement-breakpoint
CREATE INDEX "parks_cms_id_idx" ON "parks" USING btree ("cms_id");--> statement-breakpoint
CREATE INDEX "parks_slug_idx" ON "parks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "thing_images_thing_id_idx" ON "thing_images" USING btree ("thing_id");--> statement-breakpoint
CREATE INDEX "things_park_id_idx" ON "things" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "things_category_park_idx" ON "things" USING btree ("category_id","park_id");--> statement-breakpoint
CREATE INDEX "things_created_at_idx" ON "things" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "things_author_id_idx" ON "things" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "users_provider_id_idx" ON "users" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "votes_subject_idx" ON "votes" USING btree ("subject_type","subject_id");