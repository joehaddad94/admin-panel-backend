import { StudentService } from '@domain/students/student.service';
import { CreateStudentDto } from '@domain/students';
export declare class StudentMediator {
    private readonly service;
    constructor(service: StudentService);
    create: (data: CreateStudentDto) => Promise<any>;
    findStudents: (id?: string) => Promise<any>;
    updateStudent: (id: string, data: CreateStudentDto) => Promise<any>;
    deleteStudent: (id: string) => Promise<any>;
}
