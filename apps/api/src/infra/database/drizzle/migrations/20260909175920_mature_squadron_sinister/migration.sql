CREATE TYPE "institution_member_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "institution_member_type" AS ENUM('STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE');--> statement-breakpoint
CREATE TABLE "institution_members" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"institution_id" text NOT NULL,
	"type" "institution_member_type" NOT NULL,
	"status" "institution_member_status" DEFAULT 'ACTIVE'::"institution_member_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "institution_members_user_idx" ON "institution_members" ("user_id");--> statement-breakpoint
CREATE INDEX "institution_members_institution_idx" ON "institution_members" ("institution_id");--> statement-breakpoint
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_institution_id_institutions_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id");