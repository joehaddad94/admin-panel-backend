import { ApiProperty } from '@nestjs/swagger';
import {
  questionDifficultyValues,
  QuestionDifficulty,
  questionTypeValues,
  QuestionType,
} from '../../../data/types';

export class QuestionResponse {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty({
    enum: questionDifficultyValues,
    enumName: 'QuestionDifficulty',
  })
  difficulty: QuestionDifficulty;

  @ApiProperty({ enum: questionTypeValues, enumName: 'QuestionType' })
  type: QuestionType;
}
