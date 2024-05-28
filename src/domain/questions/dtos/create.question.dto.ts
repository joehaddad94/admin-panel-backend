import { QuestionDifficulty } from 'src/core/data/types/questions/difficulty';
import { QuestionType } from 'src/core/data/types/questions/type';
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
