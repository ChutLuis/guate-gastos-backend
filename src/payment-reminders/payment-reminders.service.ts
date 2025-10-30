import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentReminderDto } from './dto/create-payment-reminder.dto';
import { UpdatePaymentReminderDto } from './dto/update-payment-reminder.dto';

@Injectable()
export class PaymentRemindersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPaymentReminderDto: CreatePaymentReminderDto) {
    return this.prisma.paymentReminder.create({
      data: {
        ...createPaymentReminderDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.paymentReminder.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const paymentReminder = await this.prisma.paymentReminder.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!paymentReminder) {
      throw new NotFoundException(`Payment reminder with ID ${id} not found`);
    }

    return paymentReminder;
  }

  async update(id: string, userId: string, updatePaymentReminderDto: UpdatePaymentReminderDto) {
    await this.findOne(id, userId);

    return this.prisma.paymentReminder.update({
      where: { id },
      data: updatePaymentReminderDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.paymentReminder.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
