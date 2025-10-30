import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createInstallmentDto: CreateInstallmentDto) {
    return this.prisma.installment.create({
      data: {
        ...createInstallmentDto,
        userId,
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
        card: true,
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

    return this.prisma.installment.update({
      where: { id },
      data: {
        ...updateInstallmentDto,
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
