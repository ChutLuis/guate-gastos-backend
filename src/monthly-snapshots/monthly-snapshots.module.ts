import { Module } from '@nestjs/common';
import { MonthlySnapshotsService } from './monthly-snapshots.service';
import { MonthlySnapshotsController } from './monthly-snapshots.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MonthlySnapshotsController],
  providers: [MonthlySnapshotsService],
  exports: [MonthlySnapshotsService],
})
export class MonthlySnapshotsModule {}
