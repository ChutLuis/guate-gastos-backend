import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createLoanDto: CreateLoanDto) {
    return this.prisma.loan.create({
      data: {
        ...createLoanDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.loan.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        payments: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const loan = await this.prisma.loan.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        payments: true,
      },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async update(id: string, userId: string, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id, userId);

    return this.prisma.loan.update({
      where: { id },
      data: {
        ...updateLoanDto,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.loan.update({
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
