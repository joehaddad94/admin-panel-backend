import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { Quiz } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class QuizService extends BaseService<QuizRepository, Quiz> {
  constructor(private readonly quizRepository: QuizRepository) {
    super(quizRepository);
  }
}
