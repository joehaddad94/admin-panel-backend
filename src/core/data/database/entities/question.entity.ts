import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionType, questionTypeValues } from '../../types/questions/type';
import {
  QuestionDifficulty,
  questionDifficultyValues,
} from '../../types/questions/difficulty';
import { Quiz } from './quiz.entity';
import { QuizQuestions } from '../relations/quiz-question.entity';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'varchar' })
  answer: string;

  @Column({ enum: questionDifficultyValues })
  difficulty: QuestionDifficulty;

  @Column({ enum: questionTypeValues })
  type: QuestionType;

  @OneToMany(() => QuizQuestions, (quizQuestions) => quizQuestions.question)
  quizes: Quiz[];
}
