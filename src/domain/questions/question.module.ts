import { Module } from '@nestjs/common';
import { QuestionController } from '@domain/questions/question.controller';
import { QuestionMediator } from '@domain/questions/question.mediator';
import { QuestionService } from '@domain/questions/question.service';
import { QuestionRepository } from '@domain/questions/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@core/data/database';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionMediator, QuestionService, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
