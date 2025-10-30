import { IsString, IsNumber, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  limitAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  spent?: number;

  @IsEnum(BudgetPeriod)
  @IsOptional()
  period?: BudgetPeriod;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  alertThreshold?: number;
}
