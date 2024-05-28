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
exports.AuthMediator = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../core/settings/base/errors/errors");
const auth_service_1 = require("./auth.service");
const operation_1 = require("../../core/helpers/operation");
const mail_service_1 = require("../mail/mail.service");
let AuthMediator = class AuthMediator {
    constructor(service, mailService) {
        this.service = service;
        this.mailService = mailService;
        this.invite = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const { email, role, name } = data;
                const verifyEmail = this.service.verifyEmail(email);
                (0, errors_1.throwBadRequest)({
                    message: 'Email is not valid',
                    errorCheck: !verifyEmail,
                });
                const found = await this.service.findOne({
                    email,
                });
                (0, errors_1.throwBadRequest)({
                    message: 'Email already in use',
                    errorCheck: !!found,
                });
                const { link, key } = await this.service.generateLink(email);
                const user = this.service.create({
                    name,
                    email,
                    role,
                    isActive: false,
                    verificationKey: key,
                });
                await user.save();
                await this.mailService.sendRegistractionMail(user);
                return { link };
            });
        };
        this.verify = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const { key, password } = data;
                const user = await this.service.findOne({
                    verificationKey: key,
                });
                (0, errors_1.throwForbidden)({
                    action: 'Verification',
                    errorCheck: !user,
                });
                user.isActive = true;
                user.verificationKey = null;
                const hashedPassword = await this.service.hashPassword(password);
                user.password = hashedPassword;
                await user.save();
                const token = await this.service.generateToken(user);
                return { token, user };
            });
        };
        this.login = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const { email, password } = data;
                const user = await this.service.findOne({
                    email,
                }, [], {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                    isActive: true,
                });
                (0, errors_1.throwBadRequest)({
                    message: 'User not found',
                    errorCheck: !user,
                });
                const isPasswordCorrect = await this.service.comparePassword(password, user.password);
                (0, errors_1.throwBadRequest)({
                    message: 'Password is incorrect',
                    errorCheck: !isPasswordCorrect,
                });
                const token = await this.service.generateToken(user);
                return { token, user };
            });
        };
        this.manualCreate = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const { email, role, name, password } = data;
                const hashedPassword = await this.service.hashPassword(password);
                const user = this.service.create({
                    name,
                    email,
                    role,
                    password: hashedPassword,
                    isActive: true,
                });
                await user.save();
                return user;
            });
        };
    }
};
AuthMediator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService])
], AuthMediator);
exports.AuthMediator = AuthMediator;
//# sourceMappingURL=auth.mediator.js.map