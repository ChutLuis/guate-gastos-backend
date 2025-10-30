import { IsString, IsNumber, IsEnum, IsBoolean, IsUUID, IsOptional, IsDateString, Min } from 'class-validator';
import { ReminderType } from '@prisma/client';

export class UpdatePaymentReminderDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(ReminderType)
  @IsOptional()
  type?: ReminderType;

  @IsUUID()
  @IsOptional()
  relatedId?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationSent?: boolean;
}
