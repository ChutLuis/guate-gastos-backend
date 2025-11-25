import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RecurrenceRulesService } from './recurrence-rules.service';
import { CreateRecurrenceRuleDto } from './dto/create-recurrence-rule.dto';
import { UpdateRecurrenceRuleDto } from './dto/update-recurrence-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recurrence-rules')
@UseGuards(JwtAuthGuard)
export class RecurrenceRulesController {
  constructor(
    private readonly recurrenceRulesService: RecurrenceRulesService,
  ) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateRecurrenceRuleDto) {
    return this.recurrenceRulesService.create(req.user.userId, createDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.recurrenceRulesService.findAll(req.user.userId);
  }

  @Get('active')
  findActive(@Request() req) {
    return this.recurrenceRulesService.findActive(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.recurrenceRulesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateRecurrenceRuleDto,
  ) {
    return this.recurrenceRulesService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.recurrenceRulesService.remove(id, req.user.userId);
  }
}
