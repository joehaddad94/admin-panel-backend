import { Injectable } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';

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

      return { data: found, count, page, pageSize };
    });
  };
}
