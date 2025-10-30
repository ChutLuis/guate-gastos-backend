import { Module } from '@nestjs/common';
import { RemittancesService } from './remittances.service';
import { RemittancesController } from './remittances.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RemittancesController],
  providers: [RemittancesService],
  exports: [RemittancesService],
})
export class RemittancesModule {}
