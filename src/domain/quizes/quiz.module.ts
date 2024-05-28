import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsModule } from '../quizQuestions';
import { StudentModule } from '../students';
import { QuizController } from './quiz.controller';
import { QuizMediator } from './quiz.mediator';
import { QuizRepository } from './quiz.repository';
import { QuizService } from './quiz.service';
import { Quiz } from '../../core/data/database/entities/quiz.entity';

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
