"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationModule = void 0;
const information_entity_1 = require("../../core/data/database/entities/information.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const informattion_mediator_1 = require("./informattion.mediator");
const information_repository_1 = require("./information.repository");
const information_service_1 = require("./information.service");
const information_controller_1 = require("./information.controller");
let InformationModule = class InformationModule {
};
InformationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([information_entity_1.Information])],
        controllers: [information_controller_1.InformationController],
        providers: [informattion_mediator_1.InformationMediator, information_repository_1.InformationRepository, information_service_1.InformationService],
        exports: [information_service_1.InformationService, information_repository_1.InformationRepository],
    })
], InformationModule);
exports.InformationModule = InformationModule;
//# sourceMappingURL=information.module.js.map