import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatisticsQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  programId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  cycleId?: number;
}
