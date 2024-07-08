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
import { GetCyclesDto } from './dtos/get.cycle.dto';

@Injectable()
export class CycleMediator {
  constructor(
    private readonly cycleService: CycleService,
    private readonly programService: ProgramService,
  ) {}

  // findCycles = async (page = 1, pageSize = 100) => {
  //   return catcher(async () => {
  //     const skip = (page - 1) * pageSize;
  //     const take = pageSize;

  //     const cyclesOptions: GlobalEntities[] = ['cycleProgram'];

  //     const [found, count] = await this.cycleService.findAndCount(
  //       {},
  //       cyclesOptions,
  //       undefined,
  //       skip,
  //       take,
  //     );

  //     throwNotFound({
  //       entity: 'cycles',
  //       errorCheck: !found,
  //     });

  //     const cycles = convertToCamelCase(found);

  //     return { cycles, count, page, pageSize };
  //   });
  // };
  findCycles = async (data: GetCyclesDto) => {
    return catcher(async () => {
      console.log('entered');
      const { page, pageSize, programId } = data;
      const skip = Number((page - 1) * pageSize);
      console.log('🚀 ~ CycleMediator ~ returncatcher ~ skip:', skip);
      const take = Number(pageSize);
      console.log('🚀 ~ CycleMediator ~ returncatcher ~ take:', take);
      const cyclesOptions: GlobalEntities[] = ['cycleProgram'];

      let where = {};
      if (programId) {
        where = { cycleProgram: { program_id: programId } };
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
        errorCheck: !found.length,
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

  //   createCycle = async (admin: Admin, data: CreateCycleDto) => {
  //     return catcher(async () => {
  //       const { programId, cycleName, fromDate, toDate } = data;
  //       console.log('admin', admin);
  //       // const created_by_id = admin;

  //       const program = await this.programService.findOne({ id: programId });
  //       if (!program) {
  //         throw new Error('Failed to retrieve program details');
  //       }

  //       const existingCycle = await this.cycleService.findOne({
  //         name: cycleName,
  //       });
  //       if (existingCycle) {
  //         throw new Error('Cycle name must be unique');
  //       }

  //       const cycle = this.cycleService.create({
  //         name: cycleName,
  //         from_date: fromDate,
  //         to_date: toDate,
  //         created_at: new Date(),
  //         updated_at: new Date(),
  //         // created_by_id,
  //         // updated_by_id: created_by_id,
  //       });

  //       const createdCycle = (await this.cycleService.save(cycle)) as Cycles;

  //       if (!createdCycle || !createdCycle.id) {
  //         throw new Error('Failed to create cycle or retrieve cycle ID');
  //       }

  //       const cycleProgram = new CycleProgram();
  //       cycleProgram.cycle_id = createdCycle.id;
  //       cycleProgram.program_id = programId;

  //       await cycleProgram.save();

  //       createdCycle.cycleProgram = cycleProgram;
  //       console.log(
  //         '🚀 ~ CycleMediator ~ returncatcher ~ createdCycle:',
  //         createdCycle,
  //       );

  //       const updatedProgram = await this.programService.findOne({
  //         id: programId,
  //       });
  //       if (!updatedProgram) {
  //         throw new Error('Failed to retrieve program details');
  //       }

  //       console.log(
  //         '🚀 ~ CycleMediator ~ returncatcher ~ updatedProgram:',
  //         updatedProgram,
  //       );
  //       const camelCaseCreatedCycle = convertToCamelCase({
  //         ...createdCycle,
  //         program: updatedProgram,
  //       });

  //       return camelCaseCreatedCycle;
  //     });
  //   };
  // }
}
