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
exports.InformationUser = void 0;
const typeorm_1 = require("typeorm");
const information_entity_1 = require("../entities/information.entity");
const user_entity_1 = require("../entities/user.entity");
let InformationUser = class InformationUser extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InformationUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InformationUser.prototype, "info_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InformationUser.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => information_entity_1.Information, (information) => information.informationUser),
    (0, typeorm_1.JoinColumn)({ name: 'info_id' }),
    __metadata("design:type", information_entity_1.Information)
], InformationUser.prototype, "information", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.informationUser, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], InformationUser.prototype, "user", void 0);
InformationUser = __decorate([
    (0, typeorm_1.Entity)('information_user_id_links')
], InformationUser);
exports.InformationUser = InformationUser;
//# sourceMappingURL=information-user.entity.js.map