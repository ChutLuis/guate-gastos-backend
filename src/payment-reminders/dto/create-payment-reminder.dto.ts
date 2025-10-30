import { IsString, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsUUID, IsOptional, IsDateString, Min } from 'class-validator';
import { ReminderType } from '@prisma/client';

export class CreatePaymentReminderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(ReminderType)
  type: ReminderType;

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
