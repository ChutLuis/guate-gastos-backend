import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';

@Injectable()
export class CreditCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCreditCardDto: CreateCreditCardDto) {
    return this.prisma.creditCard.create({
      data: {
        ...createCreditCardDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.creditCard.findMany({
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
    const creditCard = await this.prisma.creditCard.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!creditCard) {
      throw new NotFoundException(`Credit card with ID ${id} not found`);
    }

    return creditCard;
  }

  async update(id: string, userId: string, updateCreditCardDto: UpdateCreditCardDto) {
    await this.findOne(id, userId);

    return this.prisma.creditCard.update({
      where: { id },
      data: {
        ...updateCreditCardDto,
        syncVersion: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.creditCard.update({
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
