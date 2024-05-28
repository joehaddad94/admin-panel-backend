import { BaseService } from '@core/settings/base/service/base.service';
import { QuizRepository } from '@domain/quizes/quiz.repository';
import { Quiz } from '@core/data/database/entities/quiz.entity';
export declare class QuizService extends BaseService<QuizRepository, Quiz> {
    private readonly quizRepository;
    constructor(quizRepository: QuizRepository);
}
