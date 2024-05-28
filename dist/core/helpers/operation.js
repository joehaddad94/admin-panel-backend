"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catcher = void 0;
const base_error_1 = require("../settings/base/errors/base.error");
const catcher = async (promise, service) => {
    var _a, _b, _c, _d;
    try {
        const result = await promise();
        return result;
    }
    catch (error) {
        const showError = process.env.NODE_ENV === 'develop';
        const status = (_a = error.status) !== null && _a !== void 0 ? _a : 500;
        const method = (_c = (_b = error.config) === null || _b === void 0 ? void 0 : _b.method) !== null && _c !== void 0 ? _c : 'NOT PROVIDED';
        const data = (_d = error.message) !== null && _d !== void 0 ? _d : 'NOT PROVIDED';
        const date = new Date().toISOString();
        console.log(`🚀 ~ catcher: error ~ Status: ${status} ~ Method: ${method} ~ ... ${date} ... ||==> service: ${service !== null && service !== void 0 ? service : 'NOT PROVIDED'}\nReason: ${JSON.stringify(data)}`);
        if (showError)
            console.log(`Stack was: ${error.stack}`);
        (0, base_error_1.throwError)(error.message, status);
    }
};
exports.catcher = catcher;
//# sourceMappingURL=operation.js.map