ALTER TABLE "jobs" ADD COLUMN "title" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "link_url" text;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "name";