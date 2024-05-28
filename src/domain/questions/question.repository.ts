import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Question } from '../../core/data/database/entities/question.entity';

@Injectable()
export class QuestionRepository extends BaseRepository<Question> {
  constructor(
    @InjectRepository(Question) questionRepository: Repository<Question>,
  ) {
    super(questionRepository);
  }
}
