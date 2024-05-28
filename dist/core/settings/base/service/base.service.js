"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const query_1 = require("../../../helpers/query");
class BaseService {
    constructor(repository) {
        this.repository = repository;
        this.getAll = async () => {
            return this.repository.getAll();
        };
        this.findOne = async (where, relations, selects) => {
            const options = (0, query_1.buildWhereParams)(where, relations, selects);
            return this.repository.findOne(options);
        };
        this.findMany = async (where, relations, selects) => {
            const options = (0, query_1.buildWhereParams)(where, relations, selects);
            return this.repository.findMany(options);
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
        this.save = async (...entities) => {
            return this.repository.save(...entities);
        };
        this.getQueryBuilder = () => {
            return this.repository.getQueryBuilder();
        };
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map