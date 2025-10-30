import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanPaymentDto } from './dto/create-loan-payment.dto';
import { UpdateLoanPaymentDto } from './dto/update-loan-payment.dto';

@Injectable()
export class LoanPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createLoanPaymentDto: CreateLoanPaymentDto) {
    // Verify the loan belongs to the user
    const loan = await this.prisma.loan.findFirst({
      where: {
        id: createLoanPaymentDto.loanId,
        userId,
        deletedAt: null,
      },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${createLoanPaymentDto.loanId} not found`);
    }

    return this.prisma.loanPayment.create({
      data: createLoanPaymentDto,
    });
  }

  async findAll(userId: string, loanId?: string) {
    const where: any = {};

    if (loanId) {
      // Verify the loan belongs to the user
      const loan = await this.prisma.loan.findFirst({
        where: {
          id: loanId,
          userId,
          deletedAt: null,
        },
      });

      if (!loan) {
        throw new NotFoundException(`Loan with ID ${loanId} not found`);
      }

      where.loanId = loanId;
    } else {
      // Get all loan IDs for the user
      const userLoans = await this.prisma.loan.findMany({
        where: { userId, deletedAt: null },
        select: { id: true },
      });

      where.loanId = {
        in: userLoans.map((loan) => loan.id),
      };
    }

    return this.prisma.loanPayment.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        loan: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const loanPayment = await this.prisma.loanPayment.findUnique({
      where: { id },
      include: {
        loan: true,
      },
    });

    if (!loanPayment) {
      throw new NotFoundException(`Loan payment with ID ${id} not found`);
    }

    // Verify the loan belongs to the user
    if (loanPayment.loan.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return loanPayment;
  }

  async update(id: string, userId: string, updateLoanPaymentDto: UpdateLoanPaymentDto) {
    await this.findOne(id, userId);

    // If updating loanId, verify the new loan belongs to the user
    if (updateLoanPaymentDto.loanId) {
      const loan = await this.prisma.loan.findFirst({
        where: {
          id: updateLoanPaymentDto.loanId,
          userId,
          deletedAt: null,
        },
      });

      if (!loan) {
        throw new NotFoundException(`Loan with ID ${updateLoanPaymentDto.loanId} not found`);
      }
    }

    return this.prisma.loanPayment.update({
      where: { id },
      data: updateLoanPaymentDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.loanPayment.delete({
      where: { id },
    });
  }
}
