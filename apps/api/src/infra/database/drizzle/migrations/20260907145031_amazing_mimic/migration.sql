CREATE TABLE "logs_audit" (
	"id" text PRIMARY KEY,
	"made_by" text NOT NULL,
	"made_at" timestamp NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"payload" text NOT NULL
);
