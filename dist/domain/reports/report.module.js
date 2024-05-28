"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const application_module_1 = require("../applications/application.module");
const information_module_1 = require("../information/information.module");
const user_module_1 = require("../users/user.module");
const common_1 = require("@nestjs/common");
const report_controller_1 = require("./report.controller");
const report_mediator_1 = require("./report.mediator");
let ReportModule = class ReportModule {
};
ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [information_module_1.InformationModule, application_module_1.ApplicationModule, user_module_1.UserModule],
        controllers: [report_controller_1.ReportController],
        providers: [report_mediator_1.ReportMediator],
        exports: [],
    })
], ReportModule);
exports.ReportModule = ReportModule;
//# sourceMappingURL=report.module.js.map