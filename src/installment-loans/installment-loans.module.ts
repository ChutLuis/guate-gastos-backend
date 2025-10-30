import { Module } from '@nestjs/common';
import { InstallmentLoansService } from './installment-loans.service';
import { InstallmentLoansController } from './installment-loans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InstallmentLoansController],
  providers: [InstallmentLoansService],
  exports: [InstallmentLoansService],
})
export class InstallmentLoansModule {}
