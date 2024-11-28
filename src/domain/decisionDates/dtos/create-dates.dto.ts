/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateEditDecisionDateDto {
  @ApiProperty()
  @IsOptional()
  examDate?: Date;

  @ApiProperty()
  @IsOptional()
  interviewMeetLink?: string;

  @ApiProperty()
  @IsOptional()
  examLink?: string;

  @ApiProperty()
  @IsOptional()
  examRegistrationForm?: string;

  @ApiProperty()
  @IsOptional()
  infoSessionRecordedLink?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'cycleId must be provided' })
  cycleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  decisionDateId?: number;
}
