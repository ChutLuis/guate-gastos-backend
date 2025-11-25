import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateInstallmentDto {
  @IsUUID()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsInt()
  @Min(1)
  totalInstallments: number;

  @IsString()
  @IsNotEmpty()
  startDate: string; // ISO date

  @IsInt()
  @Min(0)
  @IsOptional()
  paidInstallments?: number;
}
