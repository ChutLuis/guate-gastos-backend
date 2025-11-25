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
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('installments')
@UseGuards(JwtAuthGuard)
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createInstallmentDto: CreateInstallmentDto) {
    return this.installmentsService.create(user.id, createInstallmentDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.installmentsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.installmentsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateInstallmentDto: UpdateInstallmentDto,
  ) {
    return this.installmentsService.update(id, user.id, updateInstallmentDto);
  }

  @Patch(':id/pay')
  markPayment(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.installmentsService.markPayment(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.installmentsService.remove(id, user.id);
  }
}
