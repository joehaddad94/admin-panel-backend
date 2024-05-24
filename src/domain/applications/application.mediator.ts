import { Injectable } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { catcher } from '@core/helpers/operation';
import { throwNotFound } from '@core/settings/base/errors/errors';
import { GlobalEntities } from '@core/data/types';

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
