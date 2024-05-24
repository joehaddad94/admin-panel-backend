import {
  BaseEntity,
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  getAll = async (): Promise<T[]> => {
    return this.repository.find();
  };

  findOne = async (options: FindOneOptions<T>): Promise<T | null> => {
    return this.repository.findOne(options);
  };

  findMany = async (options: FindManyOptions<T>): Promise<T[]> => {
    return this.repository.find(options);
  };

  create = (data: DeepPartial<T>): T => {
    return this.repository.create(data);
  };

  update = async (
    criteria: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> => {
    return this.repository.update(criteria, data);
  };

  delete = async (criteria: FindOptionsWhere<T>): Promise<DeleteResult> => {
    return this.repository.delete(criteria);
  };

  save = (...entities: DeepPartial<T>[]): Promise<T | T[]> => {
    return entities.length > 1
      ? this.repository.save(entities)
      : this.repository.save(entities[0]);
  };

  getQueryBuilder = () => {
    return this.repository.createQueryBuilder();
  };
}
