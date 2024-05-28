import { QuestionDifficulty } from '@core/data/types/questions/difficulty';
import { QuestionType } from '@core/data/types/questions/type';
export declare class CreateQuestionDto {
    question: string;
    answer: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
}
