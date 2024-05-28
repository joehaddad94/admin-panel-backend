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
exports.QuizQuestionsService = void 0;
const base_service_1 = require("../../core/settings/base/service/base.service");
const common_1 = require("@nestjs/common");
const quiz_questions_repository_1 = require("./quiz.questions.repository");
let QuizQuestionsService = class QuizQuestionsService extends base_service_1.BaseService {
    constructor(quizQuestionsRepository) {
        super(quizQuestionsRepository);
        this.quizQuestionsRepository = quizQuestionsRepository;
        this.createMany = async (quizQuestions, quiz) => {
            const quizQuestionsQuery = this.quizQuestionsRepository.getQueryBuilder();
            const created = await quizQuestionsQuery
                .insert()
                .values(quizQuestions.map((question) => ({
                quizId: quiz.id,
                questionId: question.questionId,
                answer: question.answer,
                correct: question.correct,
                rating: question.rating,
            })))
                .execute();
            return created;
        };
    }
};
QuizQuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quiz_questions_repository_1.QuizQuestionsRepository])
], QuizQuestionsService);
exports.QuizQuestionsService = QuizQuestionsService;
//# sourceMappingURL=quiz.questions.service.js.map