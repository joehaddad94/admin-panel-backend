import { Quiz } from '@core/data/database/entities/quiz.entity';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';
export declare class QuizRepository extends BaseRepository<Quiz> {
    constructor(quizRepository: Repository<Quiz>);
}
