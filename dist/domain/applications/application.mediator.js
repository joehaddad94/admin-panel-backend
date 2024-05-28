"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationMediator = void 0;
const common_1 = require("@nestjs/common");
const application_service_1 = require("./application.service");
const operation_1 = require("../../core/helpers/operation");
const errors_1 = require("../../core/settings/base/errors/errors");
let ApplicationMediator = class ApplicationMediator {
    constructor(service) {
        this.service = service;
        this.findApplications = async () => {
            return (0, operation_1.catcher)(async () => {
                const options = [
                    'applicationInfo',
                    'applicationProgram',
                    'applicationUser',
                ];
                const found = await this.service.findMany({}, options);
                (0, errors_1.throwNotFound)({
                    entity: 'Application',
                    errorCheck: !found,
                });
                return found;
            });
        };
    }
};
ApplicationMediator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationMediator);
exports.ApplicationMediator = ApplicationMediator;
//# sourceMappingURL=application.mediator.js.map