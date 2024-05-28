import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Student } from '../../core/data/database';

@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {
    super(studentRepository);
  }
}
