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
exports.ApplicationInfo = void 0;
const typeorm_1 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
const information_entity_1 = require("../entities/information.entity");
const application_program_entity_1 = require("../relations/application-program.entity");
let ApplicationInfo = class ApplicationInfo extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ApplicationInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ApplicationInfo.prototype, "application_new_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ApplicationInfo.prototype, "info_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ApplicationInfo.prototype, "application_new_order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (application) => application.applicationInfo, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'application_new_id' }),
    __metadata("design:type", application_entity_1.Application)
], ApplicationInfo.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => information_entity_1.Information, (info) => info.applicationInfo, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'info_id' }),
    __metadata("design:type", information_entity_1.Information)
], ApplicationInfo.prototype, "info", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_program_entity_1.ApplicationProgram, (applicationProgram) => applicationProgram.application),
    __metadata("design:type", Array)
], ApplicationInfo.prototype, "applicationProgram", void 0);
ApplicationInfo = __decorate([
    (0, typeorm_1.Entity)('application_news_information_id_links')
], ApplicationInfo);
exports.ApplicationInfo = ApplicationInfo;
//# sourceMappingURL=application-info.entity.js.map