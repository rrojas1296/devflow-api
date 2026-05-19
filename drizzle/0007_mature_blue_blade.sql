ALTER TABLE "jobs" ADD COLUMN "external_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "job_id";--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_external_id_unique" UNIQUE("external_id");