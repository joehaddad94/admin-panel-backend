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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizMediator = void 0;
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const student_service_1 = require("../students/student.service");
const errors_1 = require("../../core/settings/base/errors/errors");
const operation_1 = require("../../core/helpers/operation");
const quiz_questions_service_1 = require("../quizQuestions/quiz.questions.service");
let QuizMediator = class QuizMediator {
    constructor(service, studentService, quizQuestions) {
        this.service = service;
        this.studentService = studentService;
        this.quizQuestions = quizQuestions;
        this.findQuizes = async () => {
            return (0, operation_1.catcher)(async () => {
                const found = await this.service.findMany({}, ['student', 'questions']);
                (0, errors_1.throwNotFound)({
                    entity: 'Student',
                    errorCheck: !found,
                });
                return found;
            });
        };
        this.create = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const student = await this.studentService.findOne({ id: data.studentId });
                (0, errors_1.throwNotFound)({
                    entity: 'Student',
                    errorCheck: !student,
                });
                const { studentId, answers } = data, quiz = __rest(data, ["studentId", "answers"]);
                const quizEntity = this.service.create(Object.assign(Object.assign({}, quiz), { studentId: studentId }));
                const created = await quizEntity.save();
                await this.quizQuestions.createMany(answers, created);
                return created;
            });
        };
    }
};
QuizMediator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        student_service_1.StudentService,
        quiz_questions_service_1.QuizQuestionsService])
], QuizMediator);
exports.QuizMediator = QuizMediator;
//# sourceMappingURL=quiz.mediator.js.map