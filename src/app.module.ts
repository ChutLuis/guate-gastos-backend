import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SalariesModule } from './salaries/salaries.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InstallmentsModule } from './installments/installments.module';
import { LoansModule } from './loans/loans.module';
import { LoanPaymentsModule } from './loan-payments/loan-payments.module';
import { RemittancesModule } from './remittances/remittances.module';
import { CashFlowEventsModule } from './cash-flow-events/cash-flow-events.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PaymentRemindersModule } from './payment-reminders/payment-reminders.module';
import { MonthlySnapshotsModule } from './monthly-snapshots/monthly-snapshots.module';
import { InstallmentLoansModule } from './installment-loans/installment-loans.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core modules
    PrismaModule,
    AuthModule,

    // Business modules - All CRUD endpoints ready
    SalariesModule,
    ExpensesModule,
    CreditCardsModule,
    TransactionsModule,
    InstallmentsModule,
    LoansModule,
    LoanPaymentsModule,
    RemittancesModule,
    CashFlowEventsModule,
    BudgetsModule,
    PaymentRemindersModule,
    MonthlySnapshotsModule,
    InstallmentLoansModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
