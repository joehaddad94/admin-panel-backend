import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/settings/base/service/base.service';
import { Program } from '../../core/data/database/entities/program.entity';
import { ProgramRepository } from './program.repository';

@Injectable()
export class ProgramService extends BaseService<ProgramRepository, Program> {
  constructor(private readonly programRepository: ProgramRepository) {
    super(programRepository);
  }
}
