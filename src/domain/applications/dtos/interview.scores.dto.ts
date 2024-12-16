import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsInt,
  ArrayMinSize,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class InterviewScore {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @IsInt({ message: 'Score must be an integer' })
  techScore: number;

  @ApiProperty()
  @IsInt({ message: 'Score must be an integer' })
  softScore: number;

  @ApiProperty()
  @IsString({ message: 'Score must be an string' })
  remarks: string;
}

export class InterviewScoresDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Cycle ID is required' })
  cycleId: number;

  @ApiProperty({ type: [InterviewScore] })
  @ArrayMinSize(1, { message: 'At least one interview score is required' })
  @ValidateNested({ each: true })
  @Type(() => InterviewScore)
  interviewScores: InterviewScore[];
}
