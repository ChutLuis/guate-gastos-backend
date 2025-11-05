Loaded Prisma config from prisma.config.ts.

Prisma config detected, skipping environment variable loading.
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_linked_transaction_id_fkey";

-- DropIndex
DROP INDEX "expenses_linked_transaction_id_idx";

-- DropIndex
DROP INDEX "expenses_category_idx";

-- DropIndex
DROP INDEX "expenses_is_recurring_idx";

-- AlterTable
ALTER TABLE "public"."expenses" DROP COLUMN "icon",
DROP COLUMN "is_paid_this_month",
DROP COLUMN "is_recurring",
DROP COLUMN "linked_transaction_id",
DROP COLUMN "notes",
ADD COLUMN     "paid_this_month" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "due_day" DROP NOT NULL,
ALTER COLUMN "due_day" DROP DEFAULT;

