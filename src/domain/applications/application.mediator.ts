import { Injectable } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { GlobalEntities } from 'src/core/data/types';

@Injectable()
export class ApplicationMediator {
  constructor(private readonly service: ApplicationService) {}

  findApplications = async () => {
    return catcher(async () => {
      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
      ];

      const found = await this.service.findMany({}, options);
      // const found = await this.service.findMany({});

      throwNotFound({
        entity: 'Application',
        errorCheck: !found,
      });

      return found;
    });
  };
}
