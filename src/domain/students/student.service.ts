import { Injectable } from '@nestjs/common';

import { StudentRepository } from './student.repository';
import { Student } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class StudentService extends BaseService<StudentRepository, Student> {
  constructor(private readonly studentRepository: StudentRepository) {
    super(studentRepository);
  }
}
