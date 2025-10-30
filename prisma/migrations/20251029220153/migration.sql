/*
  Warnings:

  - Added the required column `interest_rate` to the `installment_loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `installment_loans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installment_loans" ADD COLUMN     "interest_rate" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "start_date" DATE NOT NULL;
