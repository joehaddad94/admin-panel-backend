import { Question } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';
export declare class QuestionRepository extends BaseRepository<Question> {
    constructor(questionRepository: Repository<Question>);
}
