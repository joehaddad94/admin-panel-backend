import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Quiz } from '../../core/data/database';

@Injectable()
export class QuizRepository extends BaseRepository<Quiz> {
  constructor(@InjectRepository(Quiz) quizRepository: Repository<Quiz>) {
    super(quizRepository);
  }
}
