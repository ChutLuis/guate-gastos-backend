import { IsString, IsNumber, IsUUID, IsDateString, IsOptional, Min } from 'class-validator';

export class UpdateLoanPaymentDto {
  @IsUUID()
  @IsOptional()
  loanId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
