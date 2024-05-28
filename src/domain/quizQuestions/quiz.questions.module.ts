import { Module } from '@nestjs/common';
import { QuizQuestionsService } from 'src/domain/quizQuestions/quiz.questions.service';
import { QuizQuestionsRepository } from 'src/domain/quizQuestions/quiz.questions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestions } from 'src/core/data/database/relations/quiz-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestions])],
  controllers: [],
  providers: [QuizQuestionsService, QuizQuestionsRepository],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
