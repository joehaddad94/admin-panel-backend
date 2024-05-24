import { GlobalEntities } from 'src/core/data/types/query/global.entities';
import {
  BaseEntity,
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export const buildWhereParams = <T extends BaseEntity>(
  whereOptions: FindOptionsWhere<T>,
  relations?: GlobalEntities[],
  select?: FindOptionsSelect<T>,
): FindOneOptions<T> | FindManyOptions<T> => {
  const relationCheck = relations?.length > 0;

  const where: FindOptionsWhere<T> = {};

  Object.keys(whereOptions).reduce((obj, key) => {
    if (whereOptions[key]) {
      obj[key] = whereOptions[key];
    }
    return obj;
  }, where);

  return {
    where,
    relations,
    relationLoadStrategy: relationCheck ? 'join' : 'query',
    loadRelationIds: !relationCheck,
    loadEagerRelations: relationCheck,
    select: select ?? null,
  };
};
