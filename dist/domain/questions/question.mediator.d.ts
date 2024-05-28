import { QuestionService } from '@domain/questions/question.service';
import { CreateQuestionDto } from '@domain/questions';
export declare class QuestionMediator {
    private readonly service;
    constructor(service: QuestionService);
    findQuestions: () => Promise<any>;
    create: (data: CreateQuestionDto) => Promise<any>;
    delete: (id: number) => Promise<any>;
}
