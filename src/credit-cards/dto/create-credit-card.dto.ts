import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateCreditCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bank: string;

  @IsNumber()
  @Min(0)
  limit: number;

  @IsInt()
  @Min(1)
  @Max(31)
  cutoffDay: number;

  @IsInt()
  @Min(1)
  @Max(31)
  paymentDay: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  interestRate?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentBalance?: number;
}
