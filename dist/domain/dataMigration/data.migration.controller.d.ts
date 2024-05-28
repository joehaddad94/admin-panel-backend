import { DataMigrationMediator } from './data.migration.mediator';
import { DataMigrationDto } from './dtos/data.migration.dto';
import { Response } from 'express';
export declare class DataMigrationController {
    private readonly mediator;
    constructor(mediator: DataMigrationMediator);
    dataMigration(dataMigrationDto: DataMigrationDto, res: Response): void;
}
