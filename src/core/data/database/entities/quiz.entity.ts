import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestions } from '../relations/quiz-question.entity';
import { Question } from './question.entity';
import { Student } from './student.entity';
import { cascade } from '../../constants/query.consts';

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  codeRate: number;

  @Column({ type: 'float' })
  logicRate: number;

  @Column({ type: 'float' })
  theoreticalRate: number;

  @Column({ type: 'float' })
  codeScore: number;

  @Column({ type: 'float' })
  logicScore: number;

  @Column({ type: 'float' })
  theoreticalScore: number;

  @Column({ type: 'float' })
  totalScore: number;

  @Column({ type: 'varchar', default: '' })
  comments: string;

  @Column({ type: 'float' })
  pace: number;

  @OneToMany(() => QuizQuestions, (quizQuestions) => quizQuestions.quiz, {
    ...cascade,
  })
  questions: Question[];

  @OneToOne(() => Student, (student) => student.quiz, {
    ...cascade,
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: number;
}
