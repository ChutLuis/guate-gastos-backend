import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsUUID, Min } from 'class-validator';
import { TransactionType, PaymentMethod } from '@prisma/client';

export class UpdateTransactionDto {
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  relatedId?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsUUID()
  @IsOptional()
  cardId?: string;

  @IsUUID()
  @IsOptional()
  relatedExpenseId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
