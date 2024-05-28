import { StudentRepository } from '@domain/students/student.repository';
import { BaseService } from '@core/settings/base/service/base.service';
import { Student } from '@core/data/database';
export declare class StudentService extends BaseService<StudentRepository, Student> {
    private readonly studentRepository;
    constructor(studentRepository: StudentRepository);
}
