import { Injectable } from '@nestjs/common';
import { ProgramService } from './program.service';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';

@Injectable()
export class ProgramMediator {
  constructor(private readonly service: ProgramService) {}
  findPrograms = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({});

      throwNotFound({
        entity: 'Program',
        errorCheck: !found,
      });

      return found;
    });
  };
}
