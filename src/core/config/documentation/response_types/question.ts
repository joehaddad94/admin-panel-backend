import {
  QuestionDifficulty,
  questionDifficultyValues,
} from 'src/core/data/types/questions/difficulty';
import {
  QuestionType,
  questionTypeValues,
} from 'src/core/data/types/questions/type';
import { ApiProperty } from '@nestjs/swagger';

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
