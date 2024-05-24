import { Module } from '@nestjs/common';
import { QuizController } from '@domain/quizes/quiz.controller';
import { QuizMediator } from '@domain/quizes/quiz.mediator';
import { QuizService } from '@domain/quizes/quiz.service';
import { QuizRepository } from '@domain/quizes/quiz.repository';
import { StudentModule } from '@domain/students/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '@core/data/database';
import { QuizQuestionsModule } from '@domain/quizQuestions/quiz.questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    StudentModule,
    QuizQuestionsModule,
  ],
  controllers: [QuizController],
  providers: [QuizMediator, QuizService, QuizRepository],
  exports: [],
})
export class QuizModule {}
