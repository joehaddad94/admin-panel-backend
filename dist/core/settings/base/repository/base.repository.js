"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(repository) {
        this.repository = repository;
        this.getAll = async () => {
            return this.repository.find();
        };
        this.findOne = async (options) => {
            return this.repository.findOne(options);
        };
        this.findMany = async (options) => {
            return this.repository.find(options);
        };
        this.create = (data) => {
            return this.repository.create(data);
        };
        this.update = async (criteria, data) => {
            return this.repository.update(criteria, data);
        };
        this.delete = async (criteria) => {
            return this.repository.delete(criteria);
        };
        this.save = (...entities) => {
            return entities.length > 1
                ? this.repository.save(entities)
                : this.repository.save(entities[0]);
        };
        this.getQueryBuilder = () => {
            return this.repository.createQueryBuilder();
        };
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map