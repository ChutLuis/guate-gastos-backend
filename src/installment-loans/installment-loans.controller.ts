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
import { InstallmentLoansService } from './installment-loans.service';
import { CreateInstallmentLoanDto } from './dto/create-installment-loan.dto';
import { UpdateInstallmentLoanDto } from './dto/update-installment-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('installment-loans')
@UseGuards(JwtAuthGuard)
export class InstallmentLoansController {
  constructor(
    private readonly installmentLoansService: InstallmentLoansService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: any,
    @Body() createInstallmentLoanDto: CreateInstallmentLoanDto,
  ) {
    return this.installmentLoansService.create(
      user.id,
      createInstallmentLoanDto,
    );
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.installmentLoansService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.installmentLoansService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateInstallmentLoanDto: UpdateInstallmentLoanDto,
  ) {
    return this.installmentLoansService.update(
      user.id,
      id,
      updateInstallmentLoanDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.installmentLoansService.remove(user.id, id);
  }
}
