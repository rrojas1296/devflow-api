ALTER TABLE "jobs" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "isDeleted";