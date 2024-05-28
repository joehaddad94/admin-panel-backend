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
exports.StudentMediator = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("./student.service");
const errors_1 = require("../../core/settings/base/errors/errors");
const operation_1 = require("../../core/helpers/operation");
let StudentMediator = class StudentMediator {
    constructor(service) {
        this.service = service;
        this.create = async (data) => {
            return (0, operation_1.catcher)(async () => {
                const found = await this.service.findOne({
                    email: data.email,
                });
                (0, errors_1.throwBadRequest)({
                    message: 'Email already in use',
                    errorCheck: found !== null,
                });
                const created = this.service.create(data);
                await created.save();
                return created;
            });
        };
        this.findStudents = async (id) => {
            return (0, operation_1.catcher)(async () => {
                if (id) {
                    const parsed = parseInt(id);
                    const found = await this.service.findOne({
                        id: parsed,
                    }, ['quiz']);
                    (0, errors_1.throwNotFound)({
                        message: 'Student not found',
                        errorCheck: !found,
                    });
                    return found;
                }
                const found = await this.service.findMany({}, ['quiz']);
                return found.map((student) => {
                    student.interviewDate = new Date(student.interviewDate);
                    return student;
                });
            });
        };
        this.updateStudent = async (id, data) => {
            return (0, operation_1.catcher)(async () => {
                const parsed = parseInt(id);
                const found = await this.service.findOne({
                    id: parsed,
                });
                (0, errors_1.throwNotFound)({
                    message: 'Student not found',
                    errorCheck: !found,
                });
                const updated = this.service.update({
                    id: parsed,
                }, data);
                return updated;
            });
        };
        this.deleteStudent = async (id) => {
            return (0, operation_1.catcher)(async () => {
                const parsed = parseInt(id);
                const result = await this.service.delete({
                    id: parsed,
                });
                (0, errors_1.throwNotFound)({
                    message: 'Student not found',
                    errorCheck: result.affected === 0,
                });
                return result;
            });
        };
    }
};
StudentMediator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentMediator);
exports.StudentMediator = StudentMediator;
//# sourceMappingURL=student.mediator.js.map