import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.id, createTransactionDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.transactionsService.findAll(user.id);
  }

  @Get('timeline')
  async getTimeline(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Default to current month if not provided
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const end = endDate
      ? new Date(endDate)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    return this.transactionsService.getUnifiedTimeline(user.id, start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transactionsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, user.id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transactionsService.remove(id, user.id);
  }

  @Post(':recurrenceRuleId/confirm')
  @HttpCode(HttpStatus.CREATED)
  async confirmTransaction(
    @CurrentUser() user: any,
    @Param('recurrenceRuleId') recurrenceRuleId: string,
    @Body('date') date: string,
  ) {
    return this.transactionsService.confirmTransaction(
      user.id,
      recurrenceRuleId,
      new Date(date),
    );
  }
}
