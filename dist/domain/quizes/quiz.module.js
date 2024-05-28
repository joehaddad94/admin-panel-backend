"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const quiz_controller_1 = require("./quiz.controller");
const quiz_mediator_1 = require("./quiz.mediator");
const quiz_service_1 = require("./quiz.service");
const quiz_repository_1 = require("./quiz.repository");
const student_module_1 = require("../students/student.module");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../../core/data/database");
const quiz_questions_module_1 = require("../quizQuestions/quiz.questions.module");
let QuizModule = class QuizModule {
};
QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([database_1.Quiz]),
            student_module_1.StudentModule,
            quiz_questions_module_1.QuizQuestionsModule,
        ],
        controllers: [quiz_controller_1.QuizController],
        providers: [quiz_mediator_1.QuizMediator, quiz_service_1.QuizService, quiz_repository_1.QuizRepository],
        exports: [],
    })
], QuizModule);
exports.QuizModule = QuizModule;
//# sourceMappingURL=quiz.module.js.map