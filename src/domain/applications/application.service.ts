import { Injectable } from '@nestjs/common';

import { ApplicationRepository } from './application.repository';
import { BaseService } from '../../core/settings/base/service/base.service';
import { Application } from '../../core/data/database/entities/application.entity';
import { CycleService } from '../cycles/cycle.service';
import { GlobalEntities } from 'src/core/data/types';

@Injectable()
export class ApplicationService extends BaseService<
  ApplicationRepository,
  Application
> {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly cycleService: CycleService,
  ) {
    super(applicationRepository);
  }

  async getRelevantCycleId(programId: number): Promise<any | null> {
    const currentDate = new Date();

    const options: GlobalEntities[] = ['cycleProgram'];

    const whereConditions: any = {
      cycleProgram: {
        program_id: programId,
      },
    };

    const cycles = await this.cycleService.findMany(whereConditions, options);

    const sortedCycles = cycles.sort(
      (a, b) =>
        new Date(a.from_date).getTime() - new Date(b.from_date).getTime(),
    );

    const relevantCycle = sortedCycles.find(
      (cycle) => new Date(cycle.from_date) > currentDate,
    );

    return relevantCycle ? relevantCycle : null;
  }

  async getLatestCycle(programId: number): Promise<any | null> {
    const options: GlobalEntities[] = ['cycleProgram'];

    const whereConditions: any = {
      cycleProgram: {
        program_id: programId,
      },
    };

    const cycles = await this.cycleService.findMany(whereConditions, options);

    const sortedCycles = cycles.sort((a, b) => {
      const numA = parseInt(a.code.match(/\d+$/)?.[0] || '0', 10);
      const numB = parseInt(b.code.match(/\d+$/)?.[0] || '0', 10);

      return numB - numA;
    });

    const latestCycle = sortedCycles[0] || null;

    return latestCycle;
  }

  // Optimized batch update method for better performance
  async batchUpdate(updates: Array<{ id: number; data: Partial<Application> }>): Promise<void> {
    if (updates.length === 0) return;

    // Use the repository's save method for batch updates
    const entitiesToUpdate = updates.map(({ id, data }) => ({ id, ...data }));

    await this.applicationRepository.save(...entitiesToUpdate);
  }
}
