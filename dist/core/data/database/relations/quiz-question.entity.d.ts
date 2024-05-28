import { BaseEntity } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
export declare class QuizQuestions extends BaseEntity {
    quizId: number;
    questionId: number;
    answer: string;
    correct: boolean;
    rating: number;
    quiz: Quiz;
    question: Question;
}
