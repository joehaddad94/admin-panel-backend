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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const application_info_entity_1 = require("../relations/application-info.entity");
const application_program_entity_1 = require("../relations/application-program.entity");
const application_user_entity_1 = require("../relations/application-user.entity");
let Application = class Application extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Application.prototype, "passed_screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "published_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Application.prototype, "created_by_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Application.prototype, "updated_by_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "passed_screening_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Application.prototype, "passed_exam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "passed_exam_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Application.prototype, "passed_interview", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Application.prototype, "passed_interview_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Application.prototype, "enrolled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Application.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Application.prototype, "extras", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_info_entity_1.ApplicationInfo, (applicationInfo) => applicationInfo.application),
    __metadata("design:type", Array)
], Application.prototype, "applicationInfo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_program_entity_1.ApplicationProgram, (applicationProgram) => applicationProgram.application),
    __metadata("design:type", Array)
], Application.prototype, "applicationProgram", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_user_entity_1.ApplicationUser, (applicationUser) => applicationUser.application, { eager: true }),
    __metadata("design:type", Array)
], Application.prototype, "applicationUser", void 0);
Application = __decorate([
    (0, typeorm_1.Entity)('application_news')
], Application);
exports.Application = Application;
//# sourceMappingURL=application.entity.js.map