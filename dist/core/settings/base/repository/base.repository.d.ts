import { BaseEntity, DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export declare class BaseRepository<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    getAll: () => Promise<T[]>;
    findOne: (options: FindOneOptions<T>) => Promise<T | null>;
    findMany: (options: FindManyOptions<T>) => Promise<T[]>;
    create: (data: DeepPartial<T>) => T;
    update: (criteria: FindOptionsWhere<T>, data: QueryDeepPartialEntity<T>) => Promise<UpdateResult>;
    delete: (criteria: FindOptionsWhere<T>) => Promise<DeleteResult>;
    save: (...entities: DeepPartial<T>[]) => Promise<T | T[]>;
    getQueryBuilder: () => import("typeorm").SelectQueryBuilder<T>;
}
