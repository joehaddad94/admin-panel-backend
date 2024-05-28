import { Module } from '@nestjs/common';
import { QuizController } from 'src/domain/quizes/quiz.controller';
import { QuizMediator } from 'src/domain/quizes/quiz.mediator';
import { QuizService } from 'src/domain/quizes/quiz.service';
import { QuizRepository } from 'src/domain/quizes/quiz.repository';
import { StudentModule } from 'src/domain/students/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/core/data/database';
import { QuizQuestionsModule } from 'src/domain/quizQuestions/quiz.questions.module';

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
