import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentLoanDto } from './dto/create-installment-loan.dto';
import { UpdateInstallmentLoanDto } from './dto/update-installment-loan.dto';

@Injectable()
export class InstallmentLoansService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInstallmentLoanDto) {
    return this.prisma.installmentLoan.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.installmentLoan.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const loan = await this.prisma.installmentLoan.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!loan) {
      throw new NotFoundException('Installment loan not found');
    }

    return loan;
  }

  async update(userId: string, id: string, dto: UpdateInstallmentLoanDto) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.installmentLoan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Verify ownership

    await this.prisma.installmentLoan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Installment loan deleted successfully' };
  }
}
