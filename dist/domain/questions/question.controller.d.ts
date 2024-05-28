import { QuestionMediator } from './question.mediator';
import { CreateQuestionDto } from './dtos/create.question.dto';
export declare class QuestionController {
    private readonly mediator;
    constructor(mediator: QuestionMediator);
    getQuestions(): Promise<any>;
    createQuiz(data: CreateQuestionDto): Promise<any>;
    deleteQuiz(id: number): Promise<any>;
}
