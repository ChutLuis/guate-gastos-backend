import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface GhostTransaction {
  id: string;
  userId: string;
  type: string;
  description: string;
  amount: any;
  date: Date;
  category: string | null;
  status: string;
  recurrenceRuleId: string;
  isGhost: true;
  recurrenceRule: {
    id: string;
    name: string;
    frequency: string;
  };
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        card: true,
        recurrenceRule: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        card: true,
        recurrenceRule: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.findOne(id, userId);

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get unified timeline: Real transactions + Ghost transactions from active rules
   */
  async getUnifiedTimeline(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<any>> {
    // Fetch real (completed) transactions within date range
    const realTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        card: true,
        recurrenceRule: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Fetch active recurrence rules
    const activeRules = await this.prisma.recurrenceRule.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
    });

    // Generate ghost transactions
    const ghostTransactions: GhostTransaction[] = [];

    for (const rule of activeRules) {
      const ghosts = this.generateGhostTransactions(
        rule,
        startDate,
        endDate,
        realTransactions,
      );
      ghostTransactions.push(...ghosts);
    }

    // Merge and sort by date
    const timeline = [
      ...realTransactions.map((t) => ({ ...t, isGhost: false })),
      ...ghostTransactions,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return timeline;
  }

  /**
   * Generate ghost transactions for a recurrence rule within date range
   */
  private generateGhostTransactions(
    rule: any,
    startDate: Date,
    endDate: Date,
    realTransactions: any[],
  ): GhostTransaction[] {
    const ghosts: GhostTransaction[] = [];
    let currentDate = new Date(startDate);

    // Get dates where real transactions exist for this rule
    const existingDates = new Set(
      realTransactions
        .filter((t) => t.recurrenceRuleId === rule.id)
        .map((t) => t.date.toISOString().split('T')[0]),
    );

    while (currentDate <= endDate) {
      const nextOccurrence = this.calculateNextOccurrence(
        currentDate,
        rule.frequency,
        rule.dayOfMonth,
        rule.dayOfWeek,
        rule.interval,
      );

      if (nextOccurrence > endDate) break;

      // Only create ghost if no real transaction exists for this date
      const dateKey = nextOccurrence.toISOString().split('T')[0];
      if (!existingDates.has(dateKey)) {
        ghosts.push({
          id: `ghost-${rule.id}-${dateKey}`,
          userId: rule.userId,
          type: rule.type,
          description: rule.name,
          amount: rule.amount,
          date: nextOccurrence,
          category: rule.category,
          status: 'pending',
          recurrenceRuleId: rule.id,
          isGhost: true,
          recurrenceRule: {
            id: rule.id,
            name: rule.name,
            frequency: rule.frequency,
          },
        });
      }

      currentDate = new Date(nextOccurrence);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return ghosts;
  }

  /**
   * Calculate next occurrence date for a recurrence rule
   */
  private calculateNextOccurrence(
    from: Date,
    frequency: string,
    dayOfMonth?: number | null,
    dayOfWeek?: number | null,
    interval: number = 1,
  ): Date {
    const next = new Date(from);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + interval);
        break;

      case 'weekly':
        if (dayOfWeek !== null && dayOfWeek !== undefined) {
          const currentDay = next.getDay();
          let daysUntil = dayOfWeek - currentDay;
          if (daysUntil <= 0) {
            daysUntil += 7 * interval;
          }
          next.setDate(next.getDate() + daysUntil);
        } else {
          next.setDate(next.getDate() + 7 * interval);
        }
        break;

      case 'biweekly':
        next.setDate(next.getDate() + 14 * interval);
        break;

      case 'monthly':
        if (dayOfMonth !== null && dayOfMonth !== undefined) {
          next.setMonth(next.getMonth() + interval);
          const targetDay = Math.min(
            dayOfMonth,
            new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate(),
          );
          next.setDate(targetDay);
        } else {
          next.setMonth(next.getMonth() + interval);
        }
        break;

      case 'yearly':
        next.setFullYear(next.getFullYear() + interval);
        break;

      default:
        next.setMonth(next.getMonth() + 1);
    }

    return next;
  }

  /**
   * Confirm a pending/ghost transaction - converts it to a real transaction
   */
  async confirmTransaction(
    userId: string,
    recurrenceRuleId: string,
    date: Date,
  ) {
    // Create a real transaction from the ghost
    const rule = await this.prisma.recurrenceRule.findFirst({
      where: {
        id: recurrenceRuleId,
        userId,
        deletedAt: null,
      },
    });

    if (!rule) {
      throw new NotFoundException(
        `RecurrenceRule with ID ${recurrenceRuleId} not found`,
      );
    }

    return this.prisma.transaction.create({
      data: {
        userId,
        type: rule.type as any,
        description: rule.name,
        amount: rule.amount,
        date,
        category: rule.category,
        status: 'completed',
        recurrenceRuleId: rule.id,
      },
    });
  }
}
