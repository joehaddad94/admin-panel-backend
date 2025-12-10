import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  fromDate?: Date;

  @ApiProperty()
  @IsOptional()
  toDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cycleName?: string;
}
