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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const question_mediator_1 = require("./question.mediator");
const create_question_dto_1 = require("./dtos/create.question.dto");
const swagger_1 = require("@nestjs/swagger");
const question_1 = require("../../core/config/documentation/response_types/question");
const general_1 = require("../../core/config/documentation/response_types/general");
let QuestionController = class QuestionController {
    constructor(mediator) {
        this.mediator = mediator;
    }
    getQuestions() {
        return this.mediator.findQuestions();
    }
    createQuiz(data) {
        return this.mediator.create(data);
    }
    deleteQuiz(id) {
        return this.mediator.delete(id);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: [question_1.QuestionResponse],
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "getQuestions", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: question_1.QuestionResponse,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "createQuiz", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: general_1.DeleteResponse,
    }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "deleteQuiz", null);
QuestionController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [question_mediator_1.QuestionMediator])
], QuestionController);
exports.QuestionController = QuestionController;
//# sourceMappingURL=question.controller.js.map