/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateEditDecisionDateDto {
  @ApiProperty()
  @IsOptional()
  dateTime1?: Date;

  @ApiProperty()
  @IsOptional()
  link1?: string;

  @ApiProperty()
  @IsOptional()
  link4?: string;

  @ApiProperty()
  @IsOptional()
  link3?: string;

  @ApiProperty()
  @IsOptional()
  link2?: string;

  @ApiProperty()
  @IsOptional()
  date1?: Date;

  @ApiProperty()
  @IsOptional()
  date2?: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'cycleId must be provided' })
  cycleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  decisionDateId?: number;
}
