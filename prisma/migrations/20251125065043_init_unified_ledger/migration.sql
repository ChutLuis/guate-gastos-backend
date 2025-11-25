/*
  Warnings:

  - The values [card_payment,installment_payment] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `related_expense_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `expenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionSubtype" AS ENUM ('salary', 'freelance', 'bonus', 'sale', 'gift', 'investment', 'remittance', 'other_income', 'fixed', 'variable', 'card_payment', 'installment', 'loan_payment');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('primary_job', 'secondary_job', 'freelance', 'business', 'investments', 'gifts', 'remittances', 'other');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense');
ALTER TABLE "transactions" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_linked_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "salaries" DROP CONSTRAINT "salaries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_related_expense_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "related_expense_id",
ADD COLUMN     "income_source" "IncomeSource",
ADD COLUMN     "is_fixed_expense" BOOLEAN DEFAULT false,
ADD COLUMN     "is_recurring" BOOLEAN DEFAULT false,
ADD COLUMN     "recurrence_config" JSONB,
ADD COLUMN     "recurrence_rule_id" UUID,
ADD COLUMN     "related_transaction_id" UUID,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "transaction_subtype" "TransactionSubtype";

-- DropTable
DROP TABLE "expenses";

-- DropTable
DROP TABLE "salaries";

-- DropEnum
DROP TYPE "SalaryType";

-- CreateTable
CREATE TABLE "recurrence_rules" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "category" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "day_of_month" INTEGER,
    "day_of_week" INTEGER,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "auto_generate" BOOLEAN NOT NULL DEFAULT true,
    "last_generated" TIMESTAMP(3),
    "next_generation" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "sync_version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "recurrence_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurrence_rules_user_id_idx" ON "recurrence_rules"("user_id");

-- CreateIndex
CREATE INDEX "recurrence_rules_user_id_deleted_at_idx" ON "recurrence_rules"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "recurrence_rules_user_id_is_active_idx" ON "recurrence_rules"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "recurrence_rules_next_generation_idx" ON "recurrence_rules"("next_generation");

-- CreateIndex
CREATE INDEX "transactions_transaction_subtype_idx" ON "transactions"("transaction_subtype");

-- CreateIndex
CREATE INDEX "transactions_is_recurring_idx" ON "transactions"("is_recurring");

-- CreateIndex
CREATE INDEX "transactions_income_source_idx" ON "transactions"("income_source");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_recurrence_rule_id_idx" ON "transactions"("recurrence_rule_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_status_idx" ON "transactions"("user_id", "status");

-- AddForeignKey
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurrence_rule_id_fkey" FOREIGN KEY ("recurrence_rule_id") REFERENCES "recurrence_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_transaction_id_fkey" FOREIGN KEY ("related_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
