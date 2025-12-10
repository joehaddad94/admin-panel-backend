import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { CycleRepository } from './cycle.repository';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';

@Injectable()
export class CycleService extends BaseService<CycleRepository, Cycles> {
  constructor(private readonly cycleRepository: CycleRepository) {
    super(cycleRepository);
  }

  async generateCycleCode(
    programAbbreviation: string,
    programId: number,
  ): Promise<string> {
    const currentYear = new Date().getFullYear().toString().slice(-2);

    const lastCycle = await this.cycleRepository.findOne({
      where: { cycleProgram: { program_id: programId } },
      order: { code: 'DESC' },
      relations: ['cycleProgram'],
    });

    const lastIncrement = lastCycle?.code
      ? parseInt(lastCycle.code.slice(-4), 10)
      : 0;
    const newIncrement = (lastIncrement + 1).toString().padStart(4, '0');

    return `SEF${programAbbreviation}${currentYear}${newIncrement}`;
  }
}
