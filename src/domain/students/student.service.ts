import { Injectable } from '@nestjs/common';
import { StudentRepository } from 'src/domain/students/student.repository';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { Student } from 'src/core/data/database';

@Injectable()
export class StudentService extends BaseService<StudentRepository, Student> {
  constructor(private readonly studentRepository: StudentRepository) {
    super(studentRepository);
  }
}
