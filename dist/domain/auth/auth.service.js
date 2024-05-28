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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../core/settings/base/service/base.service");
const auth_repository_1 = require("./auth.repository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService extends base_service_1.BaseService {
    constructor(authRepository, jwtService) {
        super(authRepository);
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        };
        this.comparePassword = async (password, hashed) => {
            const isPasswordCorrect = await bcrypt.compare(password, hashed);
            return isPasswordCorrect;
        };
        this.verifyEmail = (email) => {
            const emailRegex = /\S+@\S+\.\S+/;
            const formatCheck = emailRegex.test(email);
            return formatCheck;
        };
        this.generateLink = async (email) => {
            const verificationKey = crypto
                .randomBytes(32)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            const link = `${process.env.VERIFY_CLIENT_URL}?key=${verificationKey}&email=${email}`;
            return { link, key: verificationKey };
        };
        this.generateToken = async (user) => {
            const payload = { sub: user.id, role: user.role };
            const token = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            });
            return token;
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map