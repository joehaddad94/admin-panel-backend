import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { cascade } from '@core/data/constants/query.consts';

@Entity({ name: 'quiz_questions' })
export class QuizQuestions extends BaseEntity {
  @PrimaryColumn({ unique: false })
  quizId: number;

  @PrimaryColumn({ unique: false })
  questionId: number;

  @Column({ type: 'varchar' })
  answer: string;

  @Column({ type: 'boolean' })
  correct: boolean;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    ...cascade,
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.quizes, {
    eager: true,
    ...cascade,
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
