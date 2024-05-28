"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereParams = void 0;
const buildWhereParams = (whereOptions, relations, select) => {
    const relationCheck = (relations === null || relations === void 0 ? void 0 : relations.length) > 0;
    const where = {};
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
        select: select !== null && select !== void 0 ? select : null,
    };
};
exports.buildWhereParams = buildWhereParams;
//# sourceMappingURL=query.js.map