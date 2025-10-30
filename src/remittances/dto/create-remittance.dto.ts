import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { RemittanceFrequency } from '@prisma/client';

export class CreateRemittanceDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsEnum(RemittanceFrequency)
  frequency: RemittanceFrequency;

  @IsNumber()
  @Min(0)
  expectedAmount: number;

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
