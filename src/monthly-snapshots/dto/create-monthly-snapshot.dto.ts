import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, Min, Matches } from 'class-validator';

export class CreateMonthlySnapshotDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in YYYY-MM format',
  })
  month: string;

  @IsNumber()
  @Min(0)
  totalIncome: number;

  @IsNumber()
  @Min(0)
  totalExpenses: number;

  @IsNumber()
  @Min(0)
  totalInstallments: number;

  @IsNumber()
  availableFunds: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  transactionCount?: number;
}
