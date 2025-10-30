import { IsString, IsNumber, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateCreditCardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bank?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  limit?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  cutoffDay?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  paymentDay?: number;

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
