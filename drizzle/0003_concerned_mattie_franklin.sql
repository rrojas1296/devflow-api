ALTER TABLE "jobs" ALTER COLUMN "modality" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "modality" SET DEFAULT 'remote'::text;--> statement-breakpoint
DROP TYPE "public"."modality";--> statement-breakpoint
CREATE TYPE "public"."modality" AS ENUM('onsite', 'remote', 'hybrid');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "modality" SET DEFAULT 'remote'::"public"."modality";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "modality" SET DATA TYPE "public"."modality" USING "modality"::"public"."modality";