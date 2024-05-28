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
exports.InformationMediator = void 0;
const operation_1 = require("../../core/helpers/operation");
const common_1 = require("@nestjs/common");
const information_service_1 = require("./information.service");
const errors_1 = require("../../core/settings/base/errors/errors");
let InformationMediator = class InformationMediator {
    constructor(service) {
        this.service = service;
        this.findInformation = async () => {
            return (0, operation_1.catcher)(async () => {
                const found = await this.service.findMany({});
                (0, errors_1.throwNotFound)({
                    entity: 'information',
                    errorCheck: !found,
                });
                return found;
            });
        };
    }
};
InformationMediator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [information_service_1.InformationService])
], InformationMediator);
exports.InformationMediator = InformationMediator;
//# sourceMappingURL=informattion.mediator.js.map