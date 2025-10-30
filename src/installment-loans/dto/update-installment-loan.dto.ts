import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallmentLoanDto } from './create-installment-loan.dto';

export class UpdateInstallmentLoanDto extends PartialType(
  CreateInstallmentLoanDto,
) {}
