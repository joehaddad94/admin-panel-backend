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
exports.QuestionResponse = void 0;
const difficulty_1 = require("../../../data/types/questions/difficulty");
const type_1 = require("../../../data/types/questions/type");
const swagger_1 = require("@nestjs/swagger");
class QuestionResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    __metadata("design:type", Number)
], QuestionResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: difficulty_1.questionDifficultyValues,
        enumName: 'QuestionDifficulty',
    }),
    __metadata("design:type", String)
], QuestionResponse.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: type_1.questionTypeValues, enumName: 'QuestionType' }),
    __metadata("design:type", String)
], QuestionResponse.prototype, "type", void 0);
exports.QuestionResponse = QuestionResponse;
//# sourceMappingURL=question.js.map