import { Repository } from 'typeorm';
import { Student } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
export declare class StudentRepository extends BaseRepository<Student> {
    private readonly studentRepository;
    constructor(studentRepository: Repository<Student>);
}
