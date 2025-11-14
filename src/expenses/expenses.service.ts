import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    // Check for duplicate expense before creating
    const existingExpense = await this.prisma.expense.findFirst({
      where: {
        userId,
        name: createExpenseDto.name,
        amount: createExpenseDto.amount,
        category: createExpenseDto.category,
        deletedAt: null,
      },
      include: {
        transactions: true,
      },
    });

    if (existingExpense) {
      console.log(`⚠️ Duplicate expense detected, returning existing: ${existingExpense.id}`);
      return existingExpense;
    }

    // No duplicate found, proceed with creating new expense
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        userId,
      },
      include: {
        transactions: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        transactions: true,
      },
      orderBy: {
        dueDay: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        transactions: true,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...updateExpenseDto,
        syncVersion: {
          increment: 1,
        },
      },
      include: {
        transactions: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.expense.update({
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
