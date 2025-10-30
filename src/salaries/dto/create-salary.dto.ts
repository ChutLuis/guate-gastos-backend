import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { SalaryType } from '@prisma/client';

export class CreateSalaryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(SalaryType)
  type: SalaryType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  firstPayment?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  secondPayment?: number;
}
