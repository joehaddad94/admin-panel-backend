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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const application_user_entity_1 = require("../relations/application-user.entity");
const information_user_entity_1 = require("../relations/information-user.entity");
let User = class User extends typeorm_2.BaseEntity {
};
__decorate([
    (0, typeorm_2.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "reset_password_token", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "confirmation_token", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], User.prototype, "confirmed", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], User.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "sef_id", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], User.prototype, "login_attempts", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "created_by_id", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "updated_by_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_user_entity_1.ApplicationUser, (applicationUser) => applicationUser.application),
    __metadata("design:type", Array)
], User.prototype, "applicationUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => information_user_entity_1.InformationUser, (informationUser) => informationUser.user),
    __metadata("design:type", Array)
], User.prototype, "informationUser", void 0);
User = __decorate([
    (0, typeorm_2.Entity)('up_users')
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map