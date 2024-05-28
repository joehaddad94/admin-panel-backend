import { BaseService } from '@core/settings/base/service/base.service';
import { InformationRepository } from './information.repository';
import { Information } from '@core/data/database/entities/information.entity';
export declare class InformationService extends BaseService<InformationRepository, Information> {
    private readonly informationRepository;
    constructor(informationRepository: InformationRepository);
}
