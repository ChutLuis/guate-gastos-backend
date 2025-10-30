import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';

@Injectable()
export class SalariesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createSalaryDto: CreateSalaryDto) {
    return this.prisma.salary.create({
      data: {
        ...createSalaryDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.salary.findMany({
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
    const salary = await this.prisma.salary.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!salary) {
      throw new NotFoundException(`Salary with ID ${id} not found`);
    }

    return salary;
  }

  async update(id: string, userId: string, updateSalaryDto: UpdateSalaryDto) {
    await this.findOne(id, userId);

    return this.prisma.salary.update({
      where: { id },
      data: {
        ...updateSalaryDto,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.salary.update({
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
