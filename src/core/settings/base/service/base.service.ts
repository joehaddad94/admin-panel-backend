import {
  BaseEntity,
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { BaseRepository } from '../repository/base.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { GlobalEntities } from '../../../data/types';
import { buildWhereParams } from '../../../helpers/query';

export class BaseService<T extends BaseRepository<E>, E extends BaseEntity> {
  constructor(private readonly repository: T) {}

  getAll = async (): Promise<E[]> => {
    return this.repository.getAll();
  };

  findOne = async (
    where: FindOptionsWhere<E>,
    relations?: GlobalEntities[],
    selects?: FindOptionsSelect<E>,
  ): Promise<E | null> => {
    const options: FindOneOptions<E> = buildWhereParams<E>(
      where,
      relations,
      selects,
    );

    return this.repository.findOne(options);
  };

  findMany = async (
    where: FindOptionsWhere<E>,
    relations?: GlobalEntities[],
    selects?: FindOptionsSelect<E>,
  ): Promise<E[]> => {
    const options: FindManyOptions<E> = buildWhereParams<E>(
      where,
      relations,
      selects,
    );

    return this.repository.findMany(options);
  };

  create = (data: DeepPartial<E>): E => {
    return this.repository.create(data);
  };

  update = async (
    criteria: FindOptionsWhere<E>,
    data: QueryDeepPartialEntity<E>,
  ): Promise<UpdateResult> => {
    return this.repository.update(criteria, data);
  };

  delete = async (criteria: FindOptionsWhere<E>): Promise<DeleteResult> => {
    return this.repository.delete(criteria);
  };

  save = async (...entities: DeepPartial<E>[]): Promise<E | E[]> => {
    return this.repository.save(...entities);
  };

  getQueryBuilder = () => {
    return this.repository.getQueryBuilder();
  };
}
