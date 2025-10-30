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
import { RemittancesService } from './remittances.service';
import { CreateRemittanceDto } from './dto/create-remittance.dto';
import { UpdateRemittanceDto } from './dto/update-remittance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('remittances')
@UseGuards(JwtAuthGuard)
export class RemittancesController {
  constructor(private readonly remittancesService: RemittancesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createRemittanceDto: CreateRemittanceDto) {
    return this.remittancesService.create(user.id, createRemittanceDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.remittancesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.remittancesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateRemittanceDto: UpdateRemittanceDto,
  ) {
    return this.remittancesService.update(id, user.id, updateRemittanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.remittancesService.remove(id, user.id);
  }
}
