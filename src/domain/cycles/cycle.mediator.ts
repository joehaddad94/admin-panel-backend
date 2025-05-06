/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { catcher } from 'src/core/helpers/operation';
import {
  throwBadRequest,
  throwNotFound,
} from 'src/core/settings/base/errors/errors';
import { CreateEditCycleDto } from './dtos/create.cycle.dto';
import { CycleProgram } from '../../core/data/database/relations/cycle-program.entity';
import { Cycles } from '../../core/data/database/entities/cycle.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { Admin, In } from 'typeorm';
import { GlobalEntities } from '../../core/data/types';
import { ProgramService } from '../programs/program.service';

@Injectable()
export class CycleMediator {
  constructor(
    private readonly cycleService: CycleService,
    private readonly programService: ProgramService,
  ) {}

  findCycles = async (programId?: number, page = 1, pageSize = 10000000) => {
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
      
      const [found, total] = await this.cycleService.findAndCount(
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

      let flattenedCycles = found.map((cycle) => ({
        ...cycle,
        programName: cycle.cycleProgram?.program?.program_name,
        abbreviation: cycle.cycleProgram?.program?.abbreviation,
      }));

      flattenedCycles = flattenedCycles.sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { numeric: true }),
    );
    
    flattenedCycles = convertToCamelCase(flattenedCycles);
    
    return { cycles: flattenedCycles, total, page, pageSize };
  });
  };
  
  createEditCycle = async (admin: Admin, data: CreateEditCycleDto) => {
    return catcher(async () => {
      const { programId, cycleName, fromDate, toDate, cycleId } = data;
      
      if (!programId) {
        throw new Error('Program ID must be provided.');
      }
      
      let cycle: Cycles;
      let savedCycle: Cycles;
      let successMessage: string;

      if (cycleId) {
        cycle = await this.cycleService.findOne({ id: cycleId }, [
          'cycleProgram',
        ]);
        if (!cycle) {
          throw new Error(`Cycle with ID ${cycleId} not found`);
        }

        if (cycleName) cycle.name = cycleName;
        if (fromDate) cycle.from_date = fromDate;
        if (toDate) cycle.to_date = toDate;
        cycle.updated_at = new Date();

        cycle = (await this.cycleService.save(cycle)) as Cycles;
        successMessage = 'Cycle updated succesfully.';
      } else {
        const exisitingCycle = await this.cycleService.findOne(
          { name: cycleName },
          ['cycleProgram'],
        );

        if (exisitingCycle) {
          throw new Error('Cycle Name must be unique.');
        }

        const program = await this.programService.findOne({ id: programId });
        if (!program) {
          throw new Error('Program with the provided ID does not exist.');
        }

        const programAbbreviation = program.abbreviation;

        const code = await this.cycleService.generateCycleCode(
          programAbbreviation,
          programId,
        );

        cycle = this.cycleService.create({
          name: cycleName,
          from_date: fromDate,
          to_date: toDate,
          code,
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
        successMessage = 'Cycle created succesfully.';

        savedCycle = await this.cycleService.findOne(
          {
            id: cycle.id,
          },
          ['cycleProgram'],
        );
        cycle.cycleProgram.program = savedCycle.cycleProgram.program;
      }

      let flattenedCycle = {
        ...cycle,
        programName: cycle.cycleProgram?.program?.program_name,
        abbreviation: cycle.cycleProgram?.program?.abbreviation,
      };

      flattenedCycle = convertToCamelCase(flattenedCycle);

      return {
        message: successMessage,
        cycle: {
          ...flattenedCycle,
        },
      };
    });
  };

  deleteCycle = async (ids: string | string[]) => {
    return catcher(async () => {
      const idArray = Array.isArray(ids) ? ids : [ids];

      const cyclesOptions: GlobalEntities[] = [
        'cycleProgram',
        'decisionDateCycle',
        'thresholdCycle',
      ];

      const cycles = await this.cycleService.findMany(
        { id: In(idArray) },
        cyclesOptions,
      );

      if (cycles.length === 0) {
        throwBadRequest({
          message: 'No cycles with the provided ID(s) exist.',
          errorCheck: true,
        });
      }

      const cyclesIdsToDelete = cycles.map((cycle) => cycle.id);

      await this.cycleService.delete({ id: In(cyclesIdsToDelete) });

      return {
        message: 'Cycle(s) successfully deleted',
        deletedIds: cyclesIdsToDelete,
      };
    });
  };
}
