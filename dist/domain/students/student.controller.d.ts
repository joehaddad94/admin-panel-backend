import { StudentMediator } from '@domain/students/student.mediator';
import { CreateStudentDto } from './dto/create.student.dto';
import { UpdateStudentDto } from './dto/update.student.dto';
export declare class StudentsController {
    private readonly mediator;
    constructor(mediator: StudentMediator);
    create(data: CreateStudentDto): Promise<any>;
    find(id?: string): Promise<any>;
    update(id: string, data: UpdateStudentDto): Promise<any>;
    delete(id: string): Promise<any>;
}
