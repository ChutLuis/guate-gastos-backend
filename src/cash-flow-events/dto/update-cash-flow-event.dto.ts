import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { CashFlowType } from '@prisma/client';

export class UpdateCashFlowEventDto {
  @IsEnum(CashFlowType)
  @IsOptional()
  type?: CashFlowType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fee?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
