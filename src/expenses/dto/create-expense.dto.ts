import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

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
