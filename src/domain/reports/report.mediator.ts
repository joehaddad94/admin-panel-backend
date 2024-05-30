import { Injectable } from '@nestjs/common';
import { FiltersDto } from './dtos/filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ApplicationRepository } from '../applications/application.repository';
import { ApplicationService } from '../applications/application.service';
import { InformationService } from '../information/information.service';
import { UserService } from '../users/user.service';
import { Application } from '../../core/data/database/entities/application.entity';
import { GlobalEntities } from '../../core/data/types';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';
import { ApplicationUser } from 'src/core/data/database/relations/application-user.entity';

@Injectable()
export class ReportMediator {
  constructor(
    private readonly informationService: InformationService,

    @InjectRepository(Application)
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationService: ApplicationService,

    private readonly userService: UserService,
  ) {}

  applicationReport = async (
    filtersDto: FiltersDto,
    page: number = 1,
    pageSize: number = 100,
  ) => {
    return catcher(async () => {
      const {
        fromDate,
        toDate,
        programId,
        page: dtoPage,
        pageSize: dtoPageSize,
      } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
      ];
      const whereConditions: any = {};

      if (fromDate && fromDate) {
        whereConditions.created_at = Between(fromDate, toDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereConditions.created_at = LessThanOrEqual(toDate);
      }

      if (programId) {
        if (whereConditions.applicationProgram === undefined) {
          whereConditions.applicationProgram = {};
        }
        whereConditions.applicationProgram.programId = programId;
      }

      const [applications, total] = await this.applicationService.findAndCount(
        whereConditions,
        options,
        undefined,
        (currentPage - 1) * currentPageSize,
        currentPageSize,
      );

      throwNotFound({
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

      return {
        mappedApplications,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      };
    });
  };

  // informationReport = async (
  //   filtersDto: FiltersDto,
  //   page: number = 1,
  //   pageSize: number = 100,
  // ) => {
  //   return catcher(async () => {
  //     const {
  //       fromDate,
  //       toDate,
  //       page: dtoPage,
  //       pageSize: dtoPageSize,
  //     } = filtersDto;

  //     const currentPage = dtoPage ?? page;
  //     const currentPageSize = dtoPageSize ?? pageSize;

  //     const options: GlobalEntities[] = ['applicationInfo', 'informationUser'];
  //     const whereConditions: any = {};

  //     if (fromDate && toDate) {
  //       whereConditions.created_at = Between(fromDate, toDate);
  //     } else if (fromDate) {
  //       whereConditions.created_at = MoreThanOrEqual(fromDate);
  //     } else if (toDate) {
  //       whereConditions.created_at = LessThanOrEqual(toDate);
  //     }

  //     const [information, total] = await this.informationService.findAndCount(
  //       whereConditions,
  //       options,
  //       undefined,
  //       (currentPage - 1) * currentPageSize,
  //       currentPageSize,
  //     );

  //     throwNotFound({
  //       entity: 'informationReport',
  //       errorCheck: !information,
  //     });

  //     return {
  //       information,
  //       total,
  //       page: currentPage,
  //       pageSize: currentPageSize,
  //     };
  //   });
  // };

  informationReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate } = filtersDto;

      const infoOptions: GlobalEntities[] = ['informationUser'];
      const infoWhereConditions: any = {};

      if (fromDate && toDate) {
        infoWhereConditions.created_at = Between(fromDate, toDate);
      } else if (fromDate) {
        infoWhereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        infoWhereConditions.created_at = LessThanOrEqual(toDate);
      }

      const information = await this.informationService.findMany(
        infoWhereConditions,
      );

      throwNotFound({
        entity: 'informationReport',
        errorCheck: !information,
      });

      const applicationOptions: GlobalEntities[] = [
        'applicationUser',
        'applicationProgram',
      ];

      const applications = await this.applicationService.findMany(
        {},
        applicationOptions,
      );

      throwNotFound({
        entity: 'informationReport',
        errorCheck: !applications,
      });

      const applicationMap = new Map(applications.map((app) => [app.id, app]));
      console.log(
        '🚀 ~ ReportMediator ~ returncatcher ~ applicationMap:',
        applicationMap,
      );

      // const combinedData = information.flatMap((info) => {
      //   if (info.applicationInfo && info.applicationInfo.length > 0) {
      //     return info.applicationInfo.map((appInfo) => {
      //       const appId = typeof appInfo === 'number' ? appInfo : appInfo.id;
      //       const application = applicationMap.get(appId);
      //       const applicationUser = application?.applicationUser?.[0]?.user;

      //       return {
      //         sef_id: applicationUser?.sef_id || info.sef_id,
      //         username: applicationUser?.username || '',
      //         email: applicationUser?.email || info.email,
      //         first_name: info.first_name,
      //         middle_name: info.middle_name,
      //         last_name: info.last_name,
      //         mother_maiden_first: info.mother_maiden_first,
      //         mother_maiden_last: info.mother_maiden_last,
      //         gender: info.gender,
      //         dob: info.dob,
      //         mobile: info.mobile,
      //         country_origin: info.country_origin,
      //         country_residence: info.country_residence,
      //         residency_status: info.residency_status,
      //         district: info.district,
      //         governate: info.governate,
      //         marital_status: info.marital_status,
      //         type_of_disability: info.type_of_disability,
      //         disability: info.disability,
      //         employment_situation: info.employment_situation,
      //         which_social: info.which_social,
      //         terms_conditions: info.terms_conditions,
      //         degree_type: info.degree_type,
      //         status: info.status,
      //         institution: info.institution,
      //         field_of_study: info.field_of_study,
      //         major_title: info.major_title,
      //         createdAt: info.created_at,
      //         program_id:
      //           application?.applicationProgram?.[0]?.program.id || '',
      //         program_name:
      //           application?.applicationProgram?.[0]?.program.program_name ||
      //           '',
      //         abbreviation:
      //           application?.applicationProgram?.[0]?.program.abbreviation ||
      //           '',
      //         passed_screening: application?.passed_screening || '',
      //         passed_screening_date: application?.passed_screening_date || '',
      //         passed_exam: application?.passed_exam || '',
      //         passed_exam_date: application?.passed_exam_date || '',
      //         passed_interview_date: application?.passed_interview_date || '',
      //         passed_interview: application?.passed_interview || '',
      //         enrolled: application?.enrolled || '',
      //         remarks: application?.remarks || '',
      //         extras: application?.extras || '',
      //       };
      //     });
      //   } else {
      //     return [
      //       {
      //         sef_id: info.sef_id,
      //         username: '',
      //         email: info.email,
      //         first_name: info.first_name,
      //         middle_name: info.middle_name,
      //         last_name: info.last_name,
      //         mother_maiden_first: info.mother_maiden_first,
      //         mother_maiden_last: info.mother_maiden_last,
      //         gender: info.gender,
      //         dob: info.dob,
      //         mobile: info.mobile,
      //         country_origin: info.country_origin,
      //         country_residence: info.country_residence,
      //         residency_status: info.residency_status,
      //         district: info.district,
      //         governate: info.governate,
      //         marital_status: info.marital_status,
      //         type_of_disability: info.type_of_disability,
      //         disability: info.disability,
      //         employment_situation: info.employment_situation,
      //         which_social: info.which_social,
      //         terms_conditions: info.terms_conditions,
      //         degree_type: info.degree_type,
      //         status: info.status,
      //         institution: info.institution,
      //         field_of_study: info.field_of_study,
      //         major_title: info.major_title,
      //         createdAt: info.created_at,
      //         program_id: '',
      //         program_name: '',
      //         abbreviation: '',
      //         passed_screening: '',
      //         passed_screening_date: '',
      //         passed_exam: '',
      //         passed_exam_date: '',
      //         passed_interview_date: '',
      //         passed_interview: '',
      //         enrolled: '',
      //         remarks: '',
      //         extras: '',
      //       },
      //     ];
      //   }
      // });

      // combinedData.sort((a, b) => a.sef_id.localeCompare(b.sef_id));

      // return {
      //   combinedData,
      // };

      const applicationMapObject = Object.fromEntries(applicationMap);

      return { information, applicationMap: applicationMapObject };
    });
  };

  usersReport = async (
    filtersDto: FiltersDto,
    page: number = 1,
    pageSize: number = 100,
  ) => {
    return catcher(async () => {
      const {
        fromDate,
        toDate,
        page: dtoPage,
        pageSize: dtoPageSize,
      } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;

      const whereConditions: any = {};

      if (fromDate && toDate) {
        whereConditions.created_at = Between(fromDate, toDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereConditions.created_at = LessThanOrEqual(toDate);
      }

      const [users, total] = await this.userService.findAndCount(
        whereConditions,
        undefined,
        undefined,
        (currentPage - 1) * currentPageSize,
        currentPageSize,
      );

      throwNotFound({
        entity: 'usersReport',
        errorCheck: !users,
      });

      return { users, total, page: currentPage, pageSize: currentPageSize };
    });
  };
}
