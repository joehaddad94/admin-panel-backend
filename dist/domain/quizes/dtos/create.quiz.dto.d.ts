import { QuestionAnswer } from '@core/data/types/questions/questions.answer';
export declare class CreateQuizDto {
    codeRating: number;
    logicRating: number;
    theoreticalRating: number;
    codingScore: number;
    logicScore: number;
    theoreticalScore: number;
    totalScore: number;
    answers: QuestionAnswer[];
    studentId: number;
}
