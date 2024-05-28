import { QuestionDifficulty } from '@core/data/types/questions/difficulty';
import { QuestionType } from '@core/data/types/questions/type';
export declare class QuestionResponse {
    id: number;
    question: string;
    answer: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
}
