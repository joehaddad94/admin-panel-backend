import { BaseEntity } from 'typeorm';
import { QuestionType } from '../../types/questions/type';
import { QuestionDifficulty } from '../../types/questions/difficulty';
import { Quiz } from './quiz.entity';
export declare class Question extends BaseEntity {
    id: number;
    question: string;
    answer: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    quizes: Quiz[];
}
