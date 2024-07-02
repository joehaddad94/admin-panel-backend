/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { CreateCycleDto } from './dtos/create.cycle.dto';
import { CycleProgram } from '../../core/data/database/relations/cycle-program.entity';
import { Cycles } from '../../core/data/database/entities/cycle.entity';

@Injectable()
export class CycleMediator {
  constructor(private readonly service: CycleService) {}

  findCycles = async (page = 1, pageSize = 100) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const [found, count] = await this.service.findAndCount(
        {},
        undefined,
        undefined,
        skip,
        take,
      );

      throwNotFound({
        entity: 'cycles',
        errorCheck: !found,
      });

      return { cycles: found, count, page, pageSize };
    });
  };

  createCycle = async (req: any, data: CreateCycleDto) => {
    return catcher(async () => {
      const { programId, cycleName, fromDate, toDate } = data;
      // console.log('user', req.user);
      // const created_by_id = req.user.id;

      const cycle = this.service.create({
        cycle_name: cycleName,
        from_date: fromDate,
        to_date: toDate,
        created_at: new Date(),
        updated_at: new Date(),
        // created_by_id,
        // updated_by_id: created_by_id,
      });

      const createdCycle = (await this.service.save(cycle)) as Cycles;

      if (!createdCycle || !createdCycle.id) {
        throw new Error('Failed to create cycle or retrieve cycle ID');
      }

      const cycleProgram = new CycleProgram();
      cycleProgram.cycle_id = createdCycle.id;
      cycleProgram.program_id = programId;

      await cycleProgram.save();

      createdCycle.cycleProgram = cycleProgram;
      await createdCycle.save();

      return createdCycle;
    });
  };
}
