/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { CreateEditCycleDto } from './dtos/create.cycle.dto';
import { CycleProgram } from '../../core/data/database/relations/cycle-program.entity';
import { Cycles } from '../../core/data/database/entities/cycle.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { Admin } from 'typeorm';
import { GlobalEntities } from '../../core/data/types';
import { ProgramService } from '../programs/program.service';
import { format } from 'date-fns';

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
        'thresholdCycle',
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

  createEditCycle = async (admin: Admin, data: CreateEditCycleDto) => {
    return catcher(async () => {
      const { programId, cycleName, fromDate, toDate, cycleId } = data;

      if (!programId) {
        throw new Error('Program ID must be provided.');
      }

      let cycle: Cycles;
      let successMessage: string;

      if (cycleId) {
        const cyclesOptions: GlobalEntities[] = [
          'cycleProgram',
          'decisionDateCycle',
          'thresholdCycle',
        ];

        cycle = await this.cycleService.findOne({ id: cycleId }, cyclesOptions);
        if (!cycle) {
          throw new Error(`Cycle with ID ${cycleId} not found`);
        }

        if (cycleName) {
          cycle.name = cycleName;
        }
        if (fromDate) {
          cycle.from_date = fromDate;
        }
        if (toDate) {
          cycle.to_date = toDate;
        }
        cycle.updated_at = new Date();

        cycle = (await this.cycleService.save(cycle)) as Cycles;
        successMessage = 'Cycle created succesfully.';
      } else {
        cycle = this.cycleService.create({
          name: cycleName,
          from_date: fromDate,
          to_date: toDate,
          created_at: new Date(),
          updated_at: new Date(),
        });

        cycle = (await this.cycleService.save(cycle)) as Cycles;

        if (!cycle || !cycle.id) {
          throw new Error('Failed to create cycle or retrieve cycle ID');
        }

        const cycleProgram = new CycleProgram();
        cycleProgram.cycle_id = cycle.id;
        cycleProgram.program_id = programId;

        await cycleProgram.save();

        cycle.cycleProgram = cycleProgram;
        successMessage = 'Cycle updated succesfully.';
      }

      const camelCaseCreatedCycle = convertToCamelCase(cycle);
      return { message: successMessage, cycle: camelCaseCreatedCycle };
    });
  };
}
