import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { RemittanceFrequency } from '@prisma/client';

export class UpdateRemittanceDto {
  @IsString()
  @IsOptional()
  sender?: string;

  @IsEnum(RemittanceFrequency)
  @IsOptional()
  frequency?: RemittanceFrequency;

  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  exchangeRate?: number;

  @IsDateString()
  @IsOptional()
  lastReceived?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
