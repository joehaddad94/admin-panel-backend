import { Module } from '@nestjs/common';
import { QuestionController } from 'src/domain/questions/question.controller';
import { QuestionMediator } from 'src/domain/questions/question.mediator';
import { QuestionService } from 'src/domain/questions/question.service';
import { QuestionRepository } from 'src/domain/questions/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionMediator, QuestionService, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
