import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRemittanceDto } from './dto/create-remittance.dto';
import { UpdateRemittanceDto } from './dto/update-remittance.dto';

@Injectable()
export class RemittancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createRemittanceDto: CreateRemittanceDto) {
    return this.prisma.remittance.create({
      data: {
        ...createRemittanceDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.remittance.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const remittance = await this.prisma.remittance.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!remittance) {
      throw new NotFoundException(`Remittance with ID ${id} not found`);
    }

    return remittance;
  }

  async update(id: string, userId: string, updateRemittanceDto: UpdateRemittanceDto) {
    await this.findOne(id, userId);

    return this.prisma.remittance.update({
      where: { id },
      data: {
        ...updateRemittanceDto,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.remittance.update({
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
