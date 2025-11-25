import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurrenceRuleDto } from './dto/create-recurrence-rule.dto';
import { UpdateRecurrenceRuleDto } from './dto/update-recurrence-rule.dto';

@Injectable()
export class RecurrenceRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDto: CreateRecurrenceRuleDto) {
    // Calculate next generation date based on frequency
    const nextGeneration = this.calculateNextGeneration(
      new Date(),
      createDto.frequency,
      createDto.dayOfMonth,
      createDto.dayOfWeek,
      createDto.interval || 1,
    );

    return this.prisma.recurrenceRule.create({
      data: {
        ...createDto,
        userId,
        nextGeneration,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.recurrenceRule.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActive(userId: string) {
    return this.prisma.recurrenceRule.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        nextGeneration: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const rule = await this.prisma.recurrenceRule.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        transactions: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });

    if (!rule) {
      throw new NotFoundException(`RecurrenceRule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: string, userId: string, updateDto: UpdateRecurrenceRuleDto) {
    await this.findOne(id, userId);

    // Recalculate next generation if frequency changed
    let nextGeneration: Date | undefined;
    if (
      updateDto.frequency ||
      updateDto.dayOfMonth !== undefined ||
      updateDto.dayOfWeek !== undefined ||
      updateDto.interval !== undefined
    ) {
      const rule = await this.prisma.recurrenceRule.findUnique({
        where: { id },
      });

      nextGeneration = this.calculateNextGeneration(
        new Date(),
        updateDto.frequency || rule!.frequency,
        updateDto.dayOfMonth !== undefined
          ? updateDto.dayOfMonth
          : rule!.dayOfMonth,
        updateDto.dayOfWeek !== undefined
          ? updateDto.dayOfWeek
          : rule!.dayOfWeek,
        updateDto.interval !== undefined ? updateDto.interval : rule!.interval,
      );
    }

    return this.prisma.recurrenceRule.update({
      where: { id },
      data: {
        ...updateDto,
        ...(nextGeneration && { nextGeneration }),
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.recurrenceRule.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Calculate the next occurrence date for a recurrence rule
   */
  private calculateNextGeneration(
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
          // Calculate days until target day of week
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
          // Handle months with fewer days (e.g., setting day 31 in February)
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
   * Update the lastGenerated and nextGeneration dates after creating a transaction
   */
  async markGenerated(id: string) {
    const rule = await this.prisma.recurrenceRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(`RecurrenceRule with ID ${id} not found`);
    }

    const now = new Date();
    const nextGeneration = this.calculateNextGeneration(
      now,
      rule.frequency,
      rule.dayOfMonth,
      rule.dayOfWeek,
      rule.interval,
    );

    return this.prisma.recurrenceRule.update({
      where: { id },
      data: {
        lastGenerated: now,
        nextGeneration,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }
}
