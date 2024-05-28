"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
const common_1 = require("@nestjs/common");
const throwError = (message, httpStatus) => {
    throw new common_1.HttpException(message, httpStatus);
};
exports.throwError = throwError;
//# sourceMappingURL=base.error.js.map