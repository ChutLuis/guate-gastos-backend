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
} from '@nestjs/common';
import { PaymentRemindersService } from './payment-reminders.service';
import { CreatePaymentReminderDto } from './dto/create-payment-reminder.dto';
import { UpdatePaymentReminderDto } from './dto/update-payment-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payment-reminders')
@UseGuards(JwtAuthGuard)
export class PaymentRemindersController {
  constructor(private readonly paymentRemindersService: PaymentRemindersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createPaymentReminderDto: CreatePaymentReminderDto) {
    return this.paymentRemindersService.create(user.id, createPaymentReminderDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.paymentRemindersService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentRemindersService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePaymentReminderDto: UpdatePaymentReminderDto,
  ) {
    return this.paymentRemindersService.update(id, user.id, updatePaymentReminderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentRemindersService.remove(id, user.id);
  }
}
