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
import { CashFlowEventsService } from './cash-flow-events.service';
import { CreateCashFlowEventDto } from './dto/create-cash-flow-event.dto';
import { UpdateCashFlowEventDto } from './dto/update-cash-flow-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('cash-flow-events')
@UseGuards(JwtAuthGuard)
export class CashFlowEventsController {
  constructor(private readonly cashFlowEventsService: CashFlowEventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createCashFlowEventDto: CreateCashFlowEventDto) {
    return this.cashFlowEventsService.create(user.id, createCashFlowEventDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.cashFlowEventsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cashFlowEventsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateCashFlowEventDto: UpdateCashFlowEventDto,
  ) {
    return this.cashFlowEventsService.update(id, user.id, updateCashFlowEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cashFlowEventsService.remove(id, user.id);
  }
}
