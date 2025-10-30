import { Module } from '@nestjs/common';
import { CashFlowEventsService } from './cash-flow-events.service';
import { CashFlowEventsController } from './cash-flow-events.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CashFlowEventsController],
  providers: [CashFlowEventsService],
  exports: [CashFlowEventsService],
})
export class CashFlowEventsModule {}
