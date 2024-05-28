import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsRepository } from './quiz.questions.repository';
import { QuizQuestionsService } from './quiz.questions.service';
import { QuizQuestions } from '../../core/data/database/relations/quiz-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestions])],
  controllers: [],
  providers: [QuizQuestionsService, QuizQuestionsRepository],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
