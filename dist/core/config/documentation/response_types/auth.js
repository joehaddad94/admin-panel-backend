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
exports.InviteResponse = exports.TokenResponse = exports.AdminResponse = void 0;
const roles_1 = require("../../../data/types/admin/roles");
const swagger_1 = require("@nestjs/swagger");
class AdminResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: roles_1.adminRoleValues }),
    __metadata("design:type", String)
], AdminResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AdminResponse.prototype, "inActive", void 0);
exports.AdminResponse = AdminResponse;
class TokenResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TokenResponse.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminResponse }),
    __metadata("design:type", AdminResponse)
], TokenResponse.prototype, "user", void 0);
exports.TokenResponse = TokenResponse;
class InviteResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InviteResponse.prototype, "link", void 0);
exports.InviteResponse = InviteResponse;
//# sourceMappingURL=auth.js.map