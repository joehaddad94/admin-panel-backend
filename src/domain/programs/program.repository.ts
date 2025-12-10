import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Program } from '../../core/data/database/entities/program.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramRepository extends BaseRepository<Program> {
  constructor(
    @InjectRepository(Program) programRespository: Repository<Program>,
  ) {
    super(programRespository);
  }
}
