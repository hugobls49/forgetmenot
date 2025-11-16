import { IsOptional, IsInt, Min } from 'class-validator';

export class MarkAsReadDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;
}

