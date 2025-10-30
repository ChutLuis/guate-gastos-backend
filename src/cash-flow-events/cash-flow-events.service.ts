import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCashFlowEventDto } from './dto/create-cash-flow-event.dto';
import { UpdateCashFlowEventDto } from './dto/update-cash-flow-event.dto';

@Injectable()
export class CashFlowEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCashFlowEventDto: CreateCashFlowEventDto) {
    return this.prisma.cashFlowEvent.create({
      data: {
        ...createCashFlowEventDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.cashFlowEvent.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const cashFlowEvent = await this.prisma.cashFlowEvent.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!cashFlowEvent) {
      throw new NotFoundException(`Cash flow event with ID ${id} not found`);
    }

    return cashFlowEvent;
  }

  async update(id: string, userId: string, updateCashFlowEventDto: UpdateCashFlowEventDto) {
    await this.findOne(id, userId);

    return this.prisma.cashFlowEvent.update({
      where: { id },
      data: updateCashFlowEventDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.cashFlowEvent.delete({
      where: { id },
    });
  }
}
