import { IsString, IsNotEmpty, IsNumber, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  limitAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  spent?: number;

  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  alertThreshold?: number;
}
