import { BaseEntity, DeepPartial, DeleteResult, FindOptionsSelect, FindOptionsWhere, UpdateResult } from 'typeorm';
import { BaseRepository } from '../repository/base.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { GlobalEntities } from 'src/core/data/types/query/global.entities';
export declare class BaseService<T extends BaseRepository<E>, E extends BaseEntity> {
    private readonly repository;
    constructor(repository: T);
    getAll: () => Promise<E[]>;
    findOne: (where: FindOptionsWhere<E>, relations?: GlobalEntities[], selects?: FindOptionsSelect<E>) => Promise<E | null>;
    findMany: (where: FindOptionsWhere<E>, relations?: GlobalEntities[], selects?: FindOptionsSelect<E>) => Promise<E[]>;
    create: (data: DeepPartial<E>) => E;
    update: (criteria: FindOptionsWhere<E>, data: QueryDeepPartialEntity<E>) => Promise<UpdateResult>;
    delete: (criteria: FindOptionsWhere<E>) => Promise<DeleteResult>;
    save: (...entities: DeepPartial<E>[]) => Promise<E | E[]>;
    getQueryBuilder: () => import("typeorm").SelectQueryBuilder<E>;
}
