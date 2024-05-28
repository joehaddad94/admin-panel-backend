import { BaseEntity } from 'typeorm';
import { Application } from '../entities/application.entity';
import { Program } from '../entities/program.entity';
export declare class ApplicationProgram extends BaseEntity {
    id: number;
    applicationId: number;
    programId: number;
    application: Application;
    program: Program;
}
