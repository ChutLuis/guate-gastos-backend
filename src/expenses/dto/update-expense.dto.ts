import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  paidThisMonth?: boolean;

  @IsDateString()
  @IsOptional()
  lastPaymentDate?: string;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dueDay?: number;
}
