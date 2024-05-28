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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const student_mediator_1 = require("./student.mediator");
const swagger_1 = require("@nestjs/swagger");
const documentation_1 = require("../../core/config/documentation");
const create_student_dto_1 = require("./dto/create.student.dto");
const update_student_dto_1 = require("./dto/update.student.dto");
let StudentsController = class StudentsController {
    constructor(mediator) {
        this.mediator = mediator;
    }
    async create(data) {
        return await this.mediator.create(data);
    }
    async find(id) {
        return await this.mediator.findStudents(id);
    }
    async update(id, data) {
        return await this.mediator.updateStudent(id, data);
    }
    async delete(id) {
        return await this.mediator.deleteStudent(id);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: documentation_1.StudentResponse,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: [documentation_1.StudentResponse] || documentation_1.StudentResponse,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: false,
    }),
    (0, common_1.Get)(':id?'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: documentation_1.UpdateResponse,
    }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: documentation_1.DeleteResponse,
    }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "delete", null);
StudentsController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [student_mediator_1.StudentMediator])
], StudentsController);
exports.StudentsController = StudentsController;
//# sourceMappingURL=student.controller.js.map