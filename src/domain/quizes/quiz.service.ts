import { BaseService } from 'src/core/settings/base/service/base.service';
import { QuizRepository } from 'src/domain/quizes/quiz.repository';
import { Quiz } from 'src/core/data/database/entities/quiz.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService extends BaseService<QuizRepository, Quiz> {
  constructor(private readonly quizRepository: QuizRepository) {
    super(quizRepository);
  }
}
