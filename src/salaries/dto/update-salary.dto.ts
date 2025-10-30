import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { SalaryType } from '@prisma/client';

export class UpdateSalaryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(SalaryType)
  @IsOptional()
  type?: SalaryType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  firstPayment?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  secondPayment?: number;
}
