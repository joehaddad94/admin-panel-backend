import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionMediator } from './question.mediator';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';
import { Question } from '../../core/data/database/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionMediator, QuestionService, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
