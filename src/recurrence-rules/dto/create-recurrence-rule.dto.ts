import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
  Max,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

enum RecurrenceType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateRecurrenceRuleDto {
  @IsEnum(RecurrenceType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  amount: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  // Recurrence Configuration
  @IsEnum(RecurrenceFrequency)
  @IsNotEmpty()
  frequency: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  dayOfMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  @Type(() => Number)
  dayOfWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  interval?: number;

  // Generation Control
  @IsOptional()
  @IsBoolean()
  autoGenerate?: boolean;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
