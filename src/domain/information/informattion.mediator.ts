import { catcher } from 'src/core/helpers/operation';
import { Injectable } from '@nestjs/common';
import { InformationService } from './information.service';
import { throwNotFound } from 'src/core/settings/base/errors/errors';

@Injectable()
export class InformationMediator {
  constructor(private readonly service: InformationService) {}

  findInformation = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({});

      throwNotFound({
        entity: 'information',
        errorCheck: !found,
      });

      return found;
    });
  };
}
