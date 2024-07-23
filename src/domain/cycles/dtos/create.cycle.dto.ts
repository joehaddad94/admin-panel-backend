import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEditCycleDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  programId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cycleId?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString({}, { message: 'fromDate must be a valid date string' })
  fromDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString({}, { message: 'toDate must be a valid date string' })
  toDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cycleName?: string;
}
