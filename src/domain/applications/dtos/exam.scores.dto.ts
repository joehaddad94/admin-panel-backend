import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ExamScore {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Score must be an number' })
  score: number;
}

export class ExamScoresDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Cycle ID is required' })
  cycleId: number;

  @ApiProperty({ type: [ExamScore] })
  @ArrayMinSize(1, { message: 'At least one exam score is required' })
  @ValidateNested({ each: true })
  @Type(() => ExamScore)
  examScores: ExamScore[];
}
