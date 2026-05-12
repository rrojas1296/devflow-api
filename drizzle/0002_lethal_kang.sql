CREATE TYPE "public"."modality" AS ENUM('ONSITE', 'REMOTE', 'HYBRID');--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "modality" "modality" DEFAULT 'REMOTE' NOT NULL;