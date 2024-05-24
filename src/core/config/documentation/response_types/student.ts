import { ApiProperty } from '@nestjs/swagger';
import { QuizResponse } from './quiz';

export class StudentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  interviewDate: Date;

  @ApiProperty()
  quiz: QuizResponse;
}
