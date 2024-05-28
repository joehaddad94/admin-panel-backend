import { BaseEntity } from 'typeorm';
import { Question } from './question.entity';
import { Student } from './student.entity';
export declare class Quiz extends BaseEntity {
    id: number;
    codeRate: number;
    logicRate: number;
    theoreticalRate: number;
    codeScore: number;
    logicScore: number;
    theoreticalScore: number;
    totalScore: number;
    comments: string;
    pace: number;
    questions: Question[];
    student: Student;
    studentId: number;
}
