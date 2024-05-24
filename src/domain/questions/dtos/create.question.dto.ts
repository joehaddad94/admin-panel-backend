import { QuestionDifficulty } from '@core/data/types/questions/difficulty';
import { QuestionType } from '@core/data/types/questions/type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  difficulty: QuestionDifficulty;

  @ApiProperty()
  type: QuestionType;
}
