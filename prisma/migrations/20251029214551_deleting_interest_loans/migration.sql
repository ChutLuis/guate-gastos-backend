/*
  Warnings:

  - You are about to drop the column `interest_rate` on the `installment_loans` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `installment_loans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "installment_loans" DROP COLUMN "interest_rate",
DROP COLUMN "start_date";
