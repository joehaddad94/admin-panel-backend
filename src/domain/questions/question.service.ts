import { BaseService } from '@core/settings/base/service/base.service';
import { QuestionRepository } from '@domain/questions/question.repository';
import { Injectable } from '@nestjs/common';
import { Question } from '@core/data/database';

@Injectable()
export class QuestionService extends BaseService<QuestionRepository, Question> {
  constructor(private readonly questionRepository: QuestionRepository) {
    super(questionRepository);
  }
}
