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
exports.ApplicationProgram = void 0;
const typeorm_1 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
const program_entity_1 = require("../entities/program.entity");
let ApplicationProgram = class ApplicationProgram extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ApplicationProgram.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_new_id', type: 'int' }),
    __metadata("design:type", Number)
], ApplicationProgram.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'program_id', type: 'int' }),
    __metadata("design:type", Number)
], ApplicationProgram.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (application) => application.applicationProgram),
    (0, typeorm_1.JoinColumn)({ name: 'application_new_id' }),
    __metadata("design:type", application_entity_1.Application)
], ApplicationProgram.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => program_entity_1.Program, (program) => program.applicationProgram, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'program_id' }),
    __metadata("design:type", program_entity_1.Program)
], ApplicationProgram.prototype, "program", void 0);
ApplicationProgram = __decorate([
    (0, typeorm_1.Entity)('application_news_program_id_links')
], ApplicationProgram);
exports.ApplicationProgram = ApplicationProgram;
//# sourceMappingURL=application-program.entity.js.map