import { Question } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository extends BaseRepository<Question> {
  constructor(
    @InjectRepository(Question) questionRepository: Repository<Question>,
  ) {
    super(questionRepository);
  }
}
