import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDateString, IsUUID, Min } from 'class-validator';
import { TransactionType, PaymentMethod } from '@prisma/client';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

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
