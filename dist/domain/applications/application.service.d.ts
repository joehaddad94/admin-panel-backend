import { BaseService } from '@core/settings/base/service/base.service';
import { Application } from '@core/data/database/entities/application.entity';
import { ApplicationRepository } from './application.repository';
export declare class ApplicationService extends BaseService<ApplicationRepository, Application> {
    private readonly applicationRepository;
    constructor(applicationRepository: ApplicationRepository);
}
