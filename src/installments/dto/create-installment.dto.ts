import { IsString, IsNotEmpty, IsNumber, IsInt, IsUUID, IsDateString, Min } from 'class-validator';

export class CreateInstallmentDto {
  @IsUUID()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  @Min(0)
  monthlyPayment: number;

  @IsInt()
  @Min(1)
  totalInstallments: number;

  @IsInt()
  @Min(0)
  paidInstallments?: number;

  @IsDateString()
  startDate: string;
}
