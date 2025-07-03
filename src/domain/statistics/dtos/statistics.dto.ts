import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class StatisticsQueryDto {
  @ApiProperty({
    required: false,
    description: 'Program ID to filter statistics',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  programId?: number;

  @ApiProperty({
    required: false,
    description: 'Cycle ID to filter statistics',
    example: 86,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  cycleId?: number;
}
