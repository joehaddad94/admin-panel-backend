import { questionAnswerValue } from 'src/core/config/documentation/request_types/quiz';
import { QuestionAnswer } from 'src/core/data/types/questions/questions.answer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizDto {
  @ApiProperty()
  codeRating: number;

  @ApiProperty()
  logicRating: number;

  @ApiProperty()
  theoreticalRating: number;

  @ApiProperty()
  codingScore: number;

  @ApiProperty()
  logicScore: number;

  @ApiProperty()
  theoreticalScore: number;

  @ApiProperty()
  totalScore: number;

  @ApiProperty({
    example: [questionAnswerValue],
  })
  answers: QuestionAnswer[];

  @ApiProperty()
  studentId: number;
}
