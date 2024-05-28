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
exports.QuizQuestions = void 0;
const typeorm_1 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
const query_consts_1 = require("../../constants/query.consts");
let QuizQuestions = class QuizQuestions extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: false }),
    __metadata("design:type", Number)
], QuizQuestions.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: false }),
    __metadata("design:type", Number)
], QuizQuestions.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], QuizQuestions.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], QuizQuestions.prototype, "correct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], QuizQuestions.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.Quiz, (quiz) => quiz.questions, Object.assign({}, query_consts_1.cascade)),
    (0, typeorm_1.JoinColumn)({ name: 'quizId' }),
    __metadata("design:type", quiz_entity_1.Quiz)
], QuizQuestions.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.quizes, Object.assign({ eager: true }, query_consts_1.cascade)),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], QuizQuestions.prototype, "question", void 0);
QuizQuestions = __decorate([
    (0, typeorm_1.Entity)({ name: 'quiz_questions' })
], QuizQuestions);
exports.QuizQuestions = QuizQuestions;
//# sourceMappingURL=quiz-question.entity.js.map