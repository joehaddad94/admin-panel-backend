import { Injectable } from '@nestjs/common';
import { StudentRepository } from '@domain/students/student.repository';
import { BaseService } from '@core/settings/base/service/base.service';
import { Student } from '@core/data/database';

@Injectable()
export class StudentService extends BaseService<StudentRepository, Student> {
  constructor(private readonly studentRepository: StudentRepository) {
    super(studentRepository);
  }
}
