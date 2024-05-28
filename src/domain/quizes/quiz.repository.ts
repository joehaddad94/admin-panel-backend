import { Quiz } from 'src/core/data/database/entities/quiz.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuizRepository extends BaseRepository<Quiz> {
  constructor(@InjectRepository(Quiz) quizRepository: Repository<Quiz>) {
    super(quizRepository);
  }
}
