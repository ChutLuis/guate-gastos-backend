-- CreateTable
CREATE TABLE "installment_loans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "monthly_payment" DECIMAL(12,2) NOT NULL,
    "total_months" INTEGER NOT NULL,
    "paid_months" INTEGER NOT NULL DEFAULT 0,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "due_day" INTEGER NOT NULL,
    "current_balance" DECIMAL(12,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "sync_version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "installment_loans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "installment_loans_user_id_idx" ON "installment_loans"("user_id");

-- CreateIndex
CREATE INDEX "installment_loans_user_id_deleted_at_idx" ON "installment_loans"("user_id", "deleted_at");

-- AddForeignKey
ALTER TABLE "installment_loans" ADD CONSTRAINT "installment_loans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
