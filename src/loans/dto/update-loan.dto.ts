import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { LoanType } from '@prisma/client';

export class UpdateLoanDto {
  @IsEnum(LoanType)
  @IsOptional()
  type?: LoanType;

  @IsString()
  @IsOptional()
  person?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  interestRate?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
