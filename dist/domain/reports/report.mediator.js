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
exports.ReportMediator = void 0;
const common_1 = require("@nestjs/common");
const operation_1 = require("../../core/helpers/operation");
const application_service_1 = require("../applications/application.service");
const information_service_1 = require("../information/information.service");
const user_service_1 = require("../users/user.service");
const errors_1 = require("../../core/settings/base/errors/errors");
const typeorm_1 = require("@nestjs/typeorm");
const application_entity_1 = require("../../core/data/database/entities/application.entity");
const application_repository_1 = require("../applications/application.repository");
const typeorm_2 = require("typeorm");
let ReportMediator = class ReportMediator {
    constructor(informationService, applicationRepository, applicationService, userService) {
        this.informationService = informationService;
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.userService = userService;
        this.applicationReport = async (filtersDto) => {
            return (0, operation_1.catcher)(async () => {
                const { fromDate, toDate, programId } = filtersDto;
                const options = [
                    'applicationInfo',
                    'applicationProgram',
                    'applicationUser',
                ];
                const whereConditions = {};
                if (fromDate && fromDate) {
                    whereConditions.created_at = (0, typeorm_2.Between)(fromDate, toDate);
                }
                else if (fromDate) {
                    whereConditions.created_at = (0, typeorm_2.MoreThanOrEqual)(fromDate);
                }
                else if (toDate) {
                    whereConditions.created_at = (0, typeorm_2.LessThanOrEqual)(toDate);
                }
                if (programId) {
                    if (whereConditions.applicationProgram === undefined) {
                        whereConditions.applicationProgram = {};
                    }
                    whereConditions.applicationProgram.programId = programId;
                }
                const applications = await this.applicationService.findMany(whereConditions, options);
                (0, errors_1.throwNotFound)({
                    entity: 'applicationReport',
                    errorCheck: !applications,
                });
                const mappedApplications = applications.map((app) => ({
                    sef_id: app.applicationUser[0].user.sef_id,
                    username: app.applicationUser[0].user.username,
                    email: app.applicationUser[0].user.email,
                    first_name: app.applicationInfo[0].info.first_name,
                    middle_name: app.applicationInfo[0].info.middle_name,
                    last_name: app.applicationInfo[0].info.last_name,
                    mother_maiden_first: app.applicationInfo[0].info.mother_maiden_first,
                    mother_maiden_last: app.applicationInfo[0].info.mother_maiden_last,
                    gender: app.applicationInfo[0].info.gender,
                    dob: app.applicationInfo[0].info.dob,
                    mobile: app.applicationInfo[0].info.mobile,
                    country_origin: app.applicationInfo[0].info.country_origin,
                    country_residence: app.applicationInfo[0].info.country_residence,
                    residency_status: app.applicationInfo[0].info.residency_status,
                    district: app.applicationInfo[0].info.district,
                    governate: app.applicationInfo[0].info.governate,
                    marital_status: app.applicationInfo[0].info.marital_status,
                    type_of_disability: app.applicationInfo[0].info.type_of_disability,
                    disability: app.applicationInfo[0].info.disability,
                    employment_situation: app.applicationInfo[0].info.employment_situation,
                    which_social: app.applicationInfo[0].info.which_social,
                    terms_conditions: app.applicationInfo[0].info.terms_conditions,
                    degree_type: app.applicationInfo[0].info.degree_type,
                    status: app.applicationInfo[0].info.status,
                    institution: app.applicationInfo[0].info.institution,
                    field_of_study: app.applicationInfo[0].info.field_of_study,
                    major_title: app.applicationInfo[0].info.major_title,
                    info_createdAt: app.applicationInfo[0].info.created_at,
                    program_name: app.applicationProgram[0].program.program_name,
                    abbreviation: app.applicationProgram[0].program.abbreviation,
                    passed_screening: app.passed_screening,
                    app_created_at: app.created_at,
                    passed_screening_date: app.passed_screening_date,
                    passed_exam: app.passed_exam,
                    passed_exam_date: app.passed_exam_date,
                    passed_interview_date: app.passed_interview_date,
                    passed_interview: app.passed_interview,
                    enrolled: app.enrolled,
                    remarks: app.remarks,
                    extras: app.extras,
                }));
                return mappedApplications;
            });
        };
        this.informationReport = async (filtersDto) => {
            return (0, operation_1.catcher)(async () => {
                const { fromDate, toDate } = filtersDto;
                const options = ['applicationInfo', 'informationUser'];
                const whereConditions = {};
                if (fromDate && toDate) {
                    whereConditions.created_at = (0, typeorm_2.Between)(fromDate, toDate);
                }
                else if (fromDate) {
                    whereConditions.created_at = (0, typeorm_2.MoreThanOrEqual)(fromDate);
                }
                else if (toDate) {
                    whereConditions.created_at = (0, typeorm_2.LessThanOrEqual)(toDate);
                }
                const information = await this.informationService.findMany(whereConditions, options);
                (0, errors_1.throwNotFound)({
                    entity: 'informationReport',
                    errorCheck: !information,
                });
                return information;
            });
        };
        this.usersReport = async (filtersDto) => {
            return (0, operation_1.catcher)(async () => {
                const { fromDate, toDate } = filtersDto;
                const whereConditions = {};
                if (fromDate && toDate) {
                    whereConditions.created_at = (0, typeorm_2.Between)(fromDate, toDate);
                }
                else if (fromDate) {
                    whereConditions.created_at = (0, typeorm_2.MoreThanOrEqual)(fromDate);
                }
                else if (toDate) {
                    whereConditions.created_at = (0, typeorm_2.LessThanOrEqual)(toDate);
                }
                const users = await this.userService.findMany(whereConditions);
                (0, errors_1.throwNotFound)({
                    entity: 'usersReport',
                    errorCheck: !users,
                });
                return users;
            });
        };
    }
};
ReportMediator = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [information_service_1.InformationService,
        application_repository_1.ApplicationRepository,
        application_service_1.ApplicationService,
        user_service_1.UserService])
], ReportMediator);
exports.ReportMediator = ReportMediator;
//# sourceMappingURL=report.mediator.js.map