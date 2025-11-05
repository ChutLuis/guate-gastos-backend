import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsInt,
  IsUUID,
  IsIn,
  MaxLength,
  Min,
  Max
} from 'class-validator';

export class CreateExpenseDto {
  // ============================================
  // REQUIRED FIELDS
  // ============================================

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['housing', 'utilities', 'transportation', 'food', 'entertainment', 'healthcare', 'debt', 'savings', 'other'])
  category: string = 'other';

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number = 15;

  @IsBoolean()
  isPaidThisMonth: boolean = false;

  @IsBoolean()
  isRecurring: boolean = true;

  // ============================================
  // OPTIONAL FIELDS
  // ============================================

  @IsString()
  @IsOptional()
  @MaxLength(10)
  icon?: string;

  @IsDateString()
  @IsOptional()
  lastPaymentDate?: string;

  @IsUUID()
  @IsOptional()
  linkedTransactionId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
