"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwBadRequest = exports.throwForbidden = exports.throwUnauthorized = exports.throwNotFound = exports.throwInternalError = void 0;
const common_1 = require("@nestjs/common");
const base_error_1 = require("./base.error");
const throwInternalError = (data) => {
    const { message } = data;
    (0, base_error_1.throwError)(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
};
exports.throwInternalError = throwInternalError;
const throwNotFound = (data) => {
    const { message, entity, errorCheck } = data;
    if (errorCheck !== null && errorCheck !== void 0 ? errorCheck : true) {
        const entityString = entity !== null ? `${entity} ` : '';
        (0, base_error_1.throwError)(message !== null && message !== void 0 ? message : `${entityString}Not Found`, common_1.HttpStatus.NOT_FOUND);
    }
};
exports.throwNotFound = throwNotFound;
const throwUnauthorized = (data) => {
    const { message, errorCheck } = data;
    if (errorCheck !== null && errorCheck !== void 0 ? errorCheck : true) {
        (0, base_error_1.throwError)(message !== null && message !== void 0 ? message : 'Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
    }
};
exports.throwUnauthorized = throwUnauthorized;
const throwForbidden = (data) => {
    const { message, action, errorCheck } = data;
    if (errorCheck !== null && errorCheck !== void 0 ? errorCheck : true) {
        const actionString = action !== null ? `${action} ` : '';
        (0, base_error_1.throwError)(message !== null && message !== void 0 ? message : `${actionString}Forbidden`, common_1.HttpStatus.FORBIDDEN);
    }
};
exports.throwForbidden = throwForbidden;
const throwBadRequest = (data) => {
    const { message, errorCheck } = data;
    if (errorCheck !== null && errorCheck !== void 0 ? errorCheck : true) {
        (0, base_error_1.throwError)(message !== null && message !== void 0 ? message : 'Bad Request', common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.throwBadRequest = throwBadRequest;
//# sourceMappingURL=errors.js.map