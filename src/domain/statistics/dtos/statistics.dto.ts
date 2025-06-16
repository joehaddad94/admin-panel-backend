import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatisticsQueryDto {
  @ApiProperty({
    required: false,
    description: 'Program abbreviation (e.g. FSE)',
  })
  @IsOptional()
  @IsString()
  programAbbreviation?: string;

  @ApiProperty({
    required: false,
    description: 'Cycle offset from most recent (default: 1)',
  })
  @IsOptional()
  @IsNumber()
  cycleOffset?: number;

  @ApiProperty({
    required: false,
    description: 'Cycle name pattern (e.g. FSE%)',
  })
  @IsOptional()
  @IsString()
  cycleNamePattern?: string;
}
