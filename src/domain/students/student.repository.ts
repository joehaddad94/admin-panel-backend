import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/core/data/database';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';

@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {
    super(studentRepository);
  }
}
