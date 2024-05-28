import { GlobalEntities } from 'src/core/data/types/query/global.entities';
import { BaseEntity, FindManyOptions, FindOneOptions, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
export declare const buildWhereParams: <T extends BaseEntity>(whereOptions: FindOptionsWhere<T>, relations?: GlobalEntities[], select?: FindOptionsSelect<T>) => FindOneOptions<T> | FindManyOptions<T>;
