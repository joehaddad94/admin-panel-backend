import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { Question } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class QuestionService extends BaseService<QuestionRepository, Question> {
  constructor(private readonly questionRepository: QuestionRepository) {
    super(questionRepository);
  }
}
