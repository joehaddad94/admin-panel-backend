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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const quiz_mediator_1 = require("./quiz.mediator");
const create_quiz_dto_1 = require("./dtos/create.quiz.dto");
const swagger_1 = require("@nestjs/swagger");
const documentation_1 = require("../../core/config/documentation");
let QuizController = class QuizController {
    constructor(mediator) {
        this.mediator = mediator;
    }
    getQuizes() {
        return this.mediator.findQuizes();
    }
    createQuiz(data) {
        return this.mediator.create(data);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: [documentation_1.QuizResponse],
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getQuizes", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: documentation_1.QuizResponse,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quiz_dto_1.CreateQuizDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "createQuiz", null);
QuizController = __decorate([
    (0, swagger_1.ApiTags)('quizes'),
    (0, common_1.Controller)('quizes'),
    __metadata("design:paramtypes", [quiz_mediator_1.QuizMediator])
], QuizController);
exports.QuizController = QuizController;
//# sourceMappingURL=quiz.controller.js.map