import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateEditCycleDto {
  @ApiProperty()
  programId?: number;

  @ApiProperty()
  cycleId?: number;

  @ApiProperty()
  @IsDateString({}, { message: 'fromDate must be a valid date string' })
  fromDate?: Date;

  @ApiProperty()
  @IsDateString({}, { message: 'toDate must be a valid date string' })
  toDate?: Date;

  @ApiProperty()
  @IsString()
  cycleName?: string;
}
