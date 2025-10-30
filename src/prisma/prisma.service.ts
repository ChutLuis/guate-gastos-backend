import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Clean database for testing
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Delete records in correct order (due to foreign key constraints)
    await this.$transaction([
      this.receipt.deleteMany(),
      this.syncLog.deleteMany(),
      this.monthlySnapshot.deleteMany(),
      this.paymentReminder.deleteMany(),
      this.budget.deleteMany(),
      this.cashFlowEvent.deleteMany(),
      this.loanPayment.deleteMany(),
      this.loan.deleteMany(),
      this.remittance.deleteMany(),
      this.installment.deleteMany(),
      this.transaction.deleteMany(),
      this.creditCard.deleteMany(),
      this.expense.deleteMany(),
      this.salary.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
