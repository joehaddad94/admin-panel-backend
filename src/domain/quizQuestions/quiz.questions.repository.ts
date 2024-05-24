import { QuizQuestions } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuizQuestionsRepository extends BaseRepository<QuizQuestions> {
  constructor(
    @InjectRepository(QuizQuestions)
    private readonly quizQuestionsRepository: Repository<QuizQuestions>,
  ) {
    super(quizQuestionsRepository);
  }
}
