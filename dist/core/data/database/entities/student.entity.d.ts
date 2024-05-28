import { BaseEntity } from 'typeorm';
import { Quiz } from './quiz.entity';
export declare class Student extends BaseEntity {
    id: number;
    name: string;
    email: string;
    interviewDate: Date;
    quiz: Quiz;
}
