-- CreateEnum
CREATE TYPE "purchase_status" AS ENUM ('pending', 'confirmed', 'cancelled', 'refund_pending', 'refunded', 'expired');

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "cancelled_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_by" TEXT,
ADD COLUMN     "created_at_ts" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refunded_at" TIMESTAMPTZ(6),
ADD COLUMN     "reminder_sent_at" TIMESTAMPTZ(6),
ADD COLUMN     "rescheduled_from" DATE,
ADD COLUMN     "review_request_sent_at" TIMESTAMPTZ(6),
ADD COLUMN     "status" "purchase_status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "thawani_payment_id" TEXT,
ADD COLUMN     "thawani_session_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "purchases_status_chosen_date_idx" ON "purchases"("status", "chosen_date");

-- CreateIndex
CREATE INDEX "purchases_user_id_idx" ON "purchases"("user_id");

-- Backfill: map the legacy (complete, paid) booleans onto the new status enum.
-- Idempotent — safe to re-run after deploy for rows inserted by old code in the
-- window between this migration and the code release. The WHERE guard skips any
-- row the new code has already touched (non-pending status or a cancellation).
UPDATE "purchases" SET
  "status" = CASE
    WHEN "complete" THEN 'confirmed'
    WHEN "paid" AND "created_at" >= CURRENT_DATE - 7 THEN 'pending'
    ELSE 'expired'
  END::"purchase_status",
  "created_at_ts" = "created_at"::timestamptz
WHERE "status" = 'pending' AND "cancelled_at" IS NULL;
