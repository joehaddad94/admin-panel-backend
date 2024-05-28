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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_mediator_1 = require("./auth.mediator");
const invite_dto_1 = require("./dto/invite.dto");
const login_dto_1 = require("./dto/login.dto");
const verify_dto_1 = require("./dto/verify.dto");
const manual_create_dto_1 = require("./dto/manual.create.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../core/config/documentation/response_types/auth");
let AuthController = class AuthController {
    constructor(mediator) {
        this.mediator = mediator;
    }
    invite(data) {
        return this.mediator.invite(data);
    }
    login(data) {
        return this.mediator.login(data);
    }
    verify(data) {
        return this.mediator.verify(data);
    }
    manualCreate(data) {
        return this.mediator.manualCreate(data);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: auth_1.InviteResponse,
    }),
    (0, common_1.Post)('invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_dto_1.InviteDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "invite", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: auth_1.TokenResponse,
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: auth_1.TokenResponse,
    }),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verify", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: auth_1.AdminResponse,
    }),
    (0, common_1.Post)('manual-create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manual_create_dto_1.ManualCreateDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "manualCreate", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_mediator_1.AuthMediator])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map