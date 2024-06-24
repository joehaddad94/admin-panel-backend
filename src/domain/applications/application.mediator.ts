import { Injectable } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { GlobalEntities } from '../../core/data/types';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';
import { FiltersDto } from '../reports/dtos/filters.dto';

@Injectable()
export class ApplicationMediator {
  constructor(private readonly service: ApplicationService) {}

  findApplications = async () => {
    return catcher(async () => {
      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
      ];

      const found = await this.service.findMany({}, options);

      throwNotFound({
        entity: 'Application',
        errorCheck: !found,
      });

      return found;
    });
  };

  findApplicationsByProgramId = async (
    filtersDto: FiltersDto,
    page = 1,
    pageSize = 100,
  ) => {
    return catcher(async () => {
      const { programId, page: dtoPage, pageSize: dtoPageSize } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
      ];
      const whereConditions: any = {};

      if (programId) {
        if (whereConditions.applicationProgram === undefined) {
          whereConditions.applicationProgram = {};
        }
        whereConditions.applicationProgram.programId = programId;
      }

      const [applications, total] = await this.service.findAndCount(
        whereConditions,
        options,
        undefined,
        (currentPage - 1) * currentPageSize,
        currentPageSize,
      );

      throwNotFound({
        entity: 'applications',
        errorCheck: !applications,
      });

      const mappedApplications = applications.map((app) => ({
        'Sef ID': app.applicationUser[0].user.sef_id,
        username: app.applicationUser[0].user.username,
        Email: app.applicationUser[0].user.email,
        'First Name': app.applicationInfo[0].info.first_name,
        middle_name: app.applicationInfo[0].info.middle_name,
        'Last Name': app.applicationInfo[0].info.last_name,
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
        Program: app.applicationProgram[0].program.abbreviation,
        passed_screening: app.passed_screening,
        'Application Date': app.created_at,
        passed_screening_date: app.passed_screening_date,
        passed_exam: app.passed_exam,
        passed_exam_date: app.passed_exam_date,
        passed_interview_date: app.passed_interview_date,
        passed_interview: app.passed_interview,
        enrolled: app.enrolled,
        remarks: app.remarks,
        extras: app.extras,
      }));

      // return mappedApplications.sort(
      //   (a, b) =>
      //     new Date(a.app_created_at).getTime() -
      //     new Date(b.app_created_at).getTime(),
      // );

      mappedApplications.sort(
        (a, b) =>
          new Date(a['Application Date']).getTime() -
          new Date(b['Application Date']).getTime(),
      );

      return {
        applications: mappedApplications,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      };
    });
  };
}
