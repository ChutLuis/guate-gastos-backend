import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonthlySnapshotDto } from './dto/create-monthly-snapshot.dto';
import { UpdateMonthlySnapshotDto } from './dto/update-monthly-snapshot.dto';

@Injectable()
export class MonthlySnapshotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createMonthlySnapshotDto: CreateMonthlySnapshotDto) {
    // Check if a snapshot already exists for this user and month
    const existing = await this.prisma.monthlySnapshot.findUnique({
      where: {
        userId_month: {
          userId,
          month: createMonthlySnapshotDto.month,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Monthly snapshot for ${createMonthlySnapshotDto.month} already exists`,
      );
    }

    return this.prisma.monthlySnapshot.create({
      data: {
        ...createMonthlySnapshotDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.monthlySnapshot.findMany({
      where: {
        userId,
      },
      orderBy: {
        month: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const monthlySnapshot = await this.prisma.monthlySnapshot.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!monthlySnapshot) {
      throw new NotFoundException(`Monthly snapshot with ID ${id} not found`);
    }

    return monthlySnapshot;
  }

  async findByMonth(userId: string, month: string) {
    const monthlySnapshot = await this.prisma.monthlySnapshot.findUnique({
      where: {
        userId_month: {
          userId,
          month,
        },
      },
    });

    if (!monthlySnapshot) {
      throw new NotFoundException(`Monthly snapshot for ${month} not found`);
    }

    return monthlySnapshot;
  }

  async update(id: string, userId: string, updateMonthlySnapshotDto: UpdateMonthlySnapshotDto) {
    await this.findOne(id, userId);

    // If updating month, check if the new month doesn't conflict
    if (updateMonthlySnapshotDto.month) {
      const existing = await this.prisma.monthlySnapshot.findUnique({
        where: {
          userId_month: {
            userId,
            month: updateMonthlySnapshotDto.month,
          },
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Monthly snapshot for ${updateMonthlySnapshotDto.month} already exists`,
        );
      }
    }

    return this.prisma.monthlySnapshot.update({
      where: { id },
      data: updateMonthlySnapshotDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.monthlySnapshot.delete({
      where: { id },
    });
  }
}
