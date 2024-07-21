/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEditDecisionDateDto {
  @ApiProperty()
  @IsDateString({}, { message: 'examDate must be a valid date string' })
  @IsNotEmpty({ message: 'examDate must be provided' })
  examDate: Date;

  @ApiProperty()
  interviewMeetLink?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'cycleId must be provided' })
  cycleId: number;

  @ApiProperty()
  decisionDateId?: number;
}
