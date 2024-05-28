import { QuizQuestions } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';
export declare class QuizQuestionsRepository extends BaseRepository<QuizQuestions> {
    private readonly quizQuestionsRepository;
    constructor(quizQuestionsRepository: Repository<QuizQuestions>);
}
