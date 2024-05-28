import { Application } from "@core/data/database/entities/application.entity";
import { BaseRepository } from "@core/settings/base/repository/base.repository";
import { Repository } from "typeorm";
export declare class ApplicationRepository extends BaseRepository<Application> {
    constructor(applicationRepository: Repository<Application>);
}
