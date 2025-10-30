import { IsString, IsNumber, IsInt, IsUUID, IsDateString, IsOptional, Min } from 'class-validator';

export class UpdateInstallmentDto {
  @IsUUID()
  @IsOptional()
  cardId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  monthlyPayment?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  totalInstallments?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  paidInstallments?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;
}
