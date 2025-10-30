import { IsString, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { LoanType } from '@prisma/client';

export class CreateLoanDto {
  @IsEnum(LoanType)
  type: LoanType;

  @IsString()
  @IsNotEmpty()
  person: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

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
