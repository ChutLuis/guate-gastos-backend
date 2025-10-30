import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstallmentLoanDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monthlyPayment: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalMonths: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  paidMonths: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentBalance?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
