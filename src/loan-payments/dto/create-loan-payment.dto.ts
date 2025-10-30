import { IsString, IsNumber, IsUUID, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateLoanPaymentDto {
  @IsUUID()
  loanId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
