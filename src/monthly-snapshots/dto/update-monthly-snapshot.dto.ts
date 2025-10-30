import { IsString, IsNumber, IsInt, IsOptional, Min, Matches } from 'class-validator';

export class UpdateMonthlySnapshotDto {
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in YYYY-MM format',
  })
  @IsOptional()
  month?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalIncome?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalExpenses?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalInstallments?: number;

  @IsNumber()
  @IsOptional()
  availableFunds?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  transactionCount?: number;
}
