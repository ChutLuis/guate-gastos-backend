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
import { LoanPaymentsService } from './loan-payments.service';
import { CreateLoanPaymentDto } from './dto/create-loan-payment.dto';
import { UpdateLoanPaymentDto } from './dto/update-loan-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('loan-payments')
@UseGuards(JwtAuthGuard)
export class LoanPaymentsController {
  constructor(private readonly loanPaymentsService: LoanPaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createLoanPaymentDto: CreateLoanPaymentDto) {
    return this.loanPaymentsService.create(user.id, createLoanPaymentDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('loanId') loanId?: string) {
    return this.loanPaymentsService.findAll(user.id, loanId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loanPaymentsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateLoanPaymentDto: UpdateLoanPaymentDto,
  ) {
    return this.loanPaymentsService.update(id, user.id, updateLoanPaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loanPaymentsService.remove(id, user.id);
  }
}
