import { ApiProperty } from '@nestjs/swagger';
import { QuestionDifficulty, QuestionType } from '../../../core/data/types';

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
