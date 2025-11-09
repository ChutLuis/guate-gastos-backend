-- ============================================
-- PRE-MIGRATION DATA TRANSFORMATION
-- Unified Transaction Model - Phase 1
-- ============================================
-- This script transforms existing data BEFORE the schema migration
-- Run this BEFORE running: npx prisma migrate dev --name unified_transaction_model
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: Migrate TransactionType enum values
-- ============================================
-- Convert 'card_payment' → type='expense' with subtype='card_payment'
-- Convert 'installment_payment' → type='expense' with subtype='installment'

-- First, add temporary columns to store the new data
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS temp_subtype VARCHAR(50),
  ADD COLUMN IF NOT EXISTS temp_type VARCHAR(50);

-- Update card_payment transactions
UPDATE transactions 
SET 
  temp_type = 'expense',
  temp_subtype = 'card_payment'
WHERE type = 'card_payment';

-- Update installment_payment transactions  
UPDATE transactions 
SET 
  temp_type = 'expense',
  temp_subtype = 'installment'
WHERE type = 'installment_payment';

-- Update regular expense transactions
UPDATE transactions 
SET 
  temp_type = 'expense',
  temp_subtype = CASE 
    WHEN is_fixed_expense = true THEN 'fixed'
    ELSE 'variable'
  END
WHERE type = 'expense';

-- Update income transactions
UPDATE transactions 
SET 
  temp_type = 'income',
  temp_subtype = CASE 
    WHEN is_recurring = true THEN 'salary'
    ELSE 'other_income'
  END
WHERE type = 'income';

-- Verification query (run to check before committing)
-- SELECT type, temp_type, temp_subtype, COUNT(*) 
-- FROM transactions 
-- GROUP BY type, temp_type, temp_subtype;

-- ============================================
-- STEP 2: Preserve Expense payment tracking data
-- ============================================
-- Create a backup table for expense payment data that will be removed
CREATE TABLE IF NOT EXISTS expense_payment_backup (
  id UUID PRIMARY KEY,
  expense_id UUID NOT NULL,
  is_paid_this_month BOOLEAN,
  last_payment_date DATE,
  linked_transaction_id UUID,
  backed_up_at TIMESTAMP DEFAULT NOW()
);

-- Backup the data that will be dropped
INSERT INTO expense_payment_backup (
  id,
  expense_id,
  is_paid_this_month,
  last_payment_date,
  linked_transaction_id
)
SELECT 
  gen_random_uuid() as id,
  id as expense_id,
  is_paid_this_month,
  last_payment_date,
  linked_transaction_id
FROM expenses
WHERE 
  is_paid_this_month IS NOT NULL 
  OR last_payment_date IS NOT NULL
  OR linked_transaction_id IS NOT NULL;

-- Log the backup
DO $$
DECLARE
  backup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO backup_count FROM expense_payment_backup;
  RAISE NOTICE 'Backed up % expense payment records', backup_count;
END $$;

-- ============================================
-- STEP 3: Verification Queries
-- ============================================
-- Run these to verify data before committing

-- Check transaction type conversions
DO $$
DECLARE
  card_payment_count INTEGER;
  installment_count INTEGER;
  income_count INTEGER;
  expense_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO card_payment_count FROM transactions WHERE type = 'card_payment';
  SELECT COUNT(*) INTO installment_count FROM transactions WHERE type = 'installment_payment';
  SELECT COUNT(*) INTO income_count FROM transactions WHERE type = 'income';
  SELECT COUNT(*) INTO expense_count FROM transactions WHERE type = 'expense';
  
  RAISE NOTICE '=== Pre-Migration Transaction Counts ===';
  RAISE NOTICE 'card_payment transactions: %', card_payment_count;
  RAISE NOTICE 'installment_payment transactions: %', installment_count;
  RAISE NOTICE 'income transactions: %', income_count;
  RAISE NOTICE 'expense transactions: %', expense_count;
  
  IF card_payment_count > 0 OR installment_count > 0 THEN
    RAISE NOTICE 'Ready for migration - temp columns populated';
  END IF;
END $$;

COMMIT;

-- ============================================
-- POST-SCHEMA-MIGRATION SCRIPT
-- ============================================
-- After running: npx prisma migrate dev --name unified_transaction_model
-- Run this to copy temp data to final columns and cleanup:
-- ============================================

-- BEGIN;

-- Copy temporary data to final columns
-- UPDATE transactions SET 
--   type = temp_type::\"TransactionType\",
--   transaction_subtype = temp_subtype::\"TransactionSubtype\"
-- WHERE temp_type IS NOT NULL;

-- Drop temporary columns
-- ALTER TABLE transactions 
--   DROP COLUMN IF EXISTS temp_type,
--   DROP COLUMN IF EXISTS temp_subtype;

-- COMMIT;

-- ============================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================
-- If something goes wrong, restore from backup:
-- ============================================

-- BEGIN;

-- Restore expense payment data from backup
-- UPDATE expenses e
-- SET 
--   is_paid_this_month = b.is_paid_this_month,
--   last_payment_date = b.last_payment_date,
--   linked_transaction_id = b.linked_transaction_id
-- FROM expense_payment_backup b
-- WHERE e.id = b.expense_id;

-- COMMIT;