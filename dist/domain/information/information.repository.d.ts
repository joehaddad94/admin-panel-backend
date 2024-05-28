import { Information } from '@core/data/database/entities/information.entity';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';
export declare class InformationRepository extends BaseRepository<Information> {
    constructor(informationRepository: Repository<Information>);
}
