import { BaseService } from '@core/settings/base/service/base.service';
import { QuestionRepository } from '@domain/questions/question.repository';
import { Question } from '@core/data/database';
export declare class QuestionService extends BaseService<QuestionRepository, Question> {
    private readonly questionRepository;
    constructor(questionRepository: QuestionRepository);
}
