import { QuizMediator } from '@domain/quizes/quiz.mediator';
import { CreateQuizDto } from './dtos/create.quiz.dto';
export declare class QuizController {
    private readonly mediator;
    constructor(mediator: QuizMediator);
    getQuizes(): Promise<any>;
    createQuiz(data: CreateQuizDto): Promise<any>;
}
