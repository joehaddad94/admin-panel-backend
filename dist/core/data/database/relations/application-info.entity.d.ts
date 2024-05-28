import { BaseEntity } from 'typeorm';
import { Application } from '../entities/application.entity';
import { Information } from '../entities/information.entity';
import { ApplicationProgram } from '../relations/application-program.entity';
export declare class ApplicationInfo extends BaseEntity {
    id: number;
    application_new_id: number;
    info_id: number;
    application_new_order: number;
    application: Application;
    info: Information;
    applicationProgram: ApplicationProgram[];
}
