/*
  Warnings:

  - You are about to drop the column `paid_this_month` on the `expenses` table. All the data in the column will be lost.
  - Made the column `category` on table `expenses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `due_day` on table `expenses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `interest_rate` to the `installment_loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `installment_loans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "paid_this_month",
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "is_paid_this_month" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_recurring" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linked_transaction_id" UUID,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'other',
ALTER COLUMN "due_day" SET NOT NULL,
ALTER COLUMN "due_day" SET DEFAULT 15;

-- AlterTable
ALTER TABLE "installment_loans" ADD COLUMN     "interest_rate" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "start_date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "expenses_linked_transaction_id_idx" ON "expenses"("linked_transaction_id");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE INDEX "expenses_is_recurring_idx" ON "expenses"("is_recurring");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_linked_transaction_id_fkey" FOREIGN KEY ("linked_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
