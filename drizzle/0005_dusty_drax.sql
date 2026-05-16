ALTER TABLE "jobs" ADD COLUMN "posted_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "posted_data";