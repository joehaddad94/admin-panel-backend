/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { CreateCycleDto } from './dtos/create.cycle.dto';
import { CycleProgram } from '../../core/data/database/relations/cycle-program.entity';
import { Cycles } from '../../core/data/database/entities/cycle.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { Admin } from 'typeorm';
import { GlobalEntities } from '../../core/data/types';
import { ProgramService } from '../programs/program.service';

@Injectable()
export class CycleMediator {
  constructor(
    private readonly cycleService: CycleService,
    private readonly programService: ProgramService,
  ) {}

  findCycles = async (programId?: number, page = 1, pageSize = 100) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const cyclesOptions: GlobalEntities[] = [
        'cycleProgram',
        'decisionDateCycle',
      ];

      let where = {};
      if (programId) {
        where = { cycleProgram: { program: { id: programId } } };
      }

      const [found, count] = await this.cycleService.findAndCount(
        where,
        cyclesOptions,
        undefined,
        skip,
        take,
      );

      throwNotFound({
        entity: 'cycles',
        errorCheck: !found,
      });

      const cycles = convertToCamelCase(found);

      return { cycles, count, page, pageSize };
    });
  };

  createCycle = async (admin: Admin, data: CreateCycleDto) => {
    return catcher(async () => {
      const { programId, cycleName, fromDate, toDate } = data;
      console.log('admin', admin);
      // const created_by_id = admin.id;

      const cycle = this.cycleService.create({
        name: cycleName,
        from_date: fromDate,
        to_date: toDate,
        created_at: new Date(),
        updated_at: new Date(),
        // created_by_id,
        // updated_by_id: created_by_id,
      });

      const createdCycle = (await this.cycleService.save(cycle)) as Cycles;

      if (!createdCycle || !createdCycle.id) {
        throw new Error('Failed to create cycle or retrieve cycle ID');
      }

      const cycleProgram = new CycleProgram();
      cycleProgram.cycle_id = createdCycle.id;
      cycleProgram.program_id = programId;

      await cycleProgram.save();

      createdCycle.cycleProgram = cycleProgram;

      const camelCaseCreatedCycle = convertToCamelCase(createdCycle);
      return camelCaseCreatedCycle;
    });
  };
}
