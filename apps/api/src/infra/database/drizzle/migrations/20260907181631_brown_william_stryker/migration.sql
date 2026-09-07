CREATE TYPE "tags_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"status" "tags_status" DEFAULT 'ACTIVE'::"tags_status" NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" ("slug");