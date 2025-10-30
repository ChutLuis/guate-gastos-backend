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
import { MonthlySnapshotsService } from './monthly-snapshots.service';
import { CreateMonthlySnapshotDto } from './dto/create-monthly-snapshot.dto';
import { UpdateMonthlySnapshotDto } from './dto/update-monthly-snapshot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('monthly-snapshots')
@UseGuards(JwtAuthGuard)
export class MonthlySnapshotsController {
  constructor(private readonly monthlySnapshotsService: MonthlySnapshotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() createMonthlySnapshotDto: CreateMonthlySnapshotDto) {
    return this.monthlySnapshotsService.create(user.id, createMonthlySnapshotDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.monthlySnapshotsService.findAll(user.id);
  }

  @Get('by-month')
  findByMonth(@CurrentUser() user: any, @Query('month') month: string) {
    return this.monthlySnapshotsService.findByMonth(user.id, month);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.monthlySnapshotsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateMonthlySnapshotDto: UpdateMonthlySnapshotDto,
  ) {
    return this.monthlySnapshotsService.update(id, user.id, updateMonthlySnapshotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.monthlySnapshotsService.remove(id, user.id);
  }
}
