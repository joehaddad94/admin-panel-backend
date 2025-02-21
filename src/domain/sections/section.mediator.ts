import { Injectable } from '@nestjs/common';
import { SectionService } from './section.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { GlobalEntities } from 'src/core/data/types';
import { convertToCamelCase } from 'src/core/helpers/camelCase';

@Injectable()
export class SectionMediator {
  constructor(private readonly sectionService: SectionService) {}

  findSections = async (cycleId?: number, page = 1, pageSize = 100000000) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const sectionOptions: GlobalEntities[] = ['sectionCycle'];

      let where = {};
      if (cycleId) {
        where = { sectionCycle: { cycle_id: cycleId } };
      }

      const [found, total] = await this.sectionService.findAndCount(
        where,
        sectionOptions,
        undefined,
        skip,
        take,
      );

      throwNotFound({
        entity: 'sections',
        errorCheck: !found,
      });

      let sections = convertToCamelCase(found);
      return { sections, total };
    });
  };
}
