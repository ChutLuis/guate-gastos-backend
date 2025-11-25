import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createInstallmentDto: CreateInstallmentDto) {
    // Calculate monthly payment
    const monthlyPayment = createInstallmentDto.totalAmount / createInstallmentDto.totalInstallments;

    return this.prisma.installment.create({
      data: {
        ...createInstallmentDto,
        monthlyPayment,
        userId,
        paidInstallments: createInstallmentDto.paidInstallments || 0,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.installment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        card: true, // Include card details
      },
    });
  }

  async findOne(id: string, userId: string) {
    const installment = await this.prisma.installment.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        card: true,
      },
    });

    if (!installment) {
      throw new NotFoundException(`Installment with ID ${id} not found`);
    }

    return installment;
  }

  async update(id: string, userId: string, updateInstallmentDto: UpdateInstallmentDto) {
    await this.findOne(id, userId);

    // Recalculate monthly payment if total amount or installments changed
    const updateData: any = { ...updateInstallmentDto };
    if (updateInstallmentDto.totalAmount && updateInstallmentDto.totalInstallments) {
      updateData.monthlyPayment = updateInstallmentDto.totalAmount / updateInstallmentDto.totalInstallments;
    }

    return this.prisma.installment.update({
      where: { id },
      data: {
        ...updateData,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async markPayment(id: string, userId: string) {
    const installment = await this.findOne(id, userId);

    if (installment.paidInstallments >= installment.totalInstallments) {
      throw new Error('All installments already paid');
    }

    return this.prisma.installment.update({
      where: { id },
      data: {
        paidInstallments: {
          increment: 1,
        },
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.installment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        syncVersion: {
          increment: 1,
        },
      },
    });
  }
}
