import { Module } from '@nestjs/common';
import { RecurrenceRulesService } from './recurrence-rules.service';
import { RecurrenceRulesController } from './recurrence-rules.controller';

@Module({
  controllers: [RecurrenceRulesController],
  providers: [RecurrenceRulesService],
})
export class RecurrenceRulesModule {}
