CREATE TABLE "institution_settings" (
	"id" text PRIMARY KEY,
	"institution_id" text NOT NULL UNIQUE,
	"should_proof" boolean DEFAULT false NOT NULL,
	"should_verify" boolean DEFAULT false NOT NULL,
	"domain" text,
	"updated_at" timestamp
);
--> statement-breakpoint
DROP TABLE "institution_members";--> statement-breakpoint
CREATE UNIQUE INDEX "institution_settings_institution_id_idx" ON "institution_settings" ("institution_id");--> statement-breakpoint
ALTER TABLE "institution_settings" ADD CONSTRAINT "institution_settings_institution_id_institutions_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id");--> statement-breakpoint
DROP TYPE "institution_member_status";--> statement-breakpoint
DROP TYPE "institution_member_type";