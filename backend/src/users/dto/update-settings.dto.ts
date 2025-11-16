import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ required: false, example: '09:00' })
  @IsOptional()
  @IsString()
  dailyReminderTime?: string;

  @ApiProperty({ required: false, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  weeklyGoal?: number;

  @ApiProperty({ required: false, example: 'light' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ required: false, example: 'fr' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, example: 'Europe/Paris' })
  @IsOptional()
  @IsString()
  timezone?: string;
}

