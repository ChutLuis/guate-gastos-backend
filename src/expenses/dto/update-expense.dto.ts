import {
  IsString,
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

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  @IsIn(['housing', 'utilities', 'transportation', 'food', 'entertainment', 'healthcare', 'debt', 'savings', 'other'])
  category?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  icon?: string;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dueDay?: number;

  @IsBoolean()
  @IsOptional()
  isPaidThisMonth?: boolean;

  @IsDateString()
  @IsOptional()
  lastPaymentDate?: string;

  @IsUUID()
  @IsOptional()
  linkedTransactionId?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
