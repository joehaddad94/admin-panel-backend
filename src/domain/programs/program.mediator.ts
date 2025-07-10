import { Injectable } from '@nestjs/common';
import { ProgramService } from './program.service';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';

@Injectable()
export class ProgramMediator {
  constructor(private readonly service: ProgramService) {}
  findPrograms = async () => {
    return catcher(async () => {
      const queryBuilder = this.service.getQueryBuilder();
      const found = await queryBuilder
        .select(['id', 'program_name', 'abbreviation'])
        .orderBy('id', 'ASC')
        .limit(1000)
        .getRawMany();

      throwNotFound({
        entity: 'Program',
        errorCheck: !found,
      });

      return found;
    });
  };
}
