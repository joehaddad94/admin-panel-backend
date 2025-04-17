/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { FiltersDto } from './dtos/filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ApplicationService } from '../applications/application.service';
import { InformationService } from '../information/information.service';
import { UserService } from '../users/user.service';
import { Application } from '../../core/data/database/entities/application.entity';
import { GlobalEntities } from '../../core/data/types';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';
import { MicrocampApplicationService } from '../microcampApplications/microcamp-applications.service';

@Injectable()
export class ReportMediator {
  constructor(
    private readonly informationService: InformationService,
    private readonly applicationService: ApplicationService,
    private readonly userService: UserService,
    private readonly microcampApplicationService: MicrocampApplicationService,
  ) {}

  applicationReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate, programId, cycleId } = filtersDto;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
        'applicationCycle',
      ];
      const whereConditions: any = {};

      if (fromDate && toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999); // Set to the end of the day
        whereConditions.created_at = Between(fromDate, adjustedToDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999);
        whereConditions.created_at = LessThanOrEqual(adjustedToDate);
      }

      if (programId) {
        if (whereConditions.applicationProgram === undefined) {
          whereConditions.applicationProgram = {};
        }
        whereConditions.applicationProgram.programId = programId;
      }

      if (cycleId) {
        if (whereConditions.applicationCycle === undefined) {
          whereConditions.applicationCycle = {};
        }
        whereConditions.applicationCycle.cycleId = cycleId;
      }

      const applications = await this.applicationService.findMany(
        whereConditions,
        options,
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
        appStatus: app.status,
        remarks: app.remarks,
        extras: app.extras,
      }));

      mappedApplications.sort(
        (a, b) =>
          new Date(a.app_created_at).getTime() -
          new Date(b.app_created_at).getTime(),
      );

      return {
        data: mappedApplications,
      };
    });
  };

  informationReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate } = filtersDto;

      const infoOptions: GlobalEntities[] = [
        'informationUser',
        'applicationInfo',
      ];
      const infoWhereConditions: any = {};

      if (fromDate && toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999); // Set to the end of the day
        infoWhereConditions.created_at = Between(fromDate, adjustedToDate);
      } else if (fromDate) {
        infoWhereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999);
        infoWhereConditions.created_at = LessThanOrEqual(adjustedToDate);
      }

      const information = await this.informationService.findMany(
        infoWhereConditions,
        infoOptions,
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

      const combinedData = information.flatMap((info: any) => {
        if (info.applicationInfo && info.applicationInfo.length > 0) {
          return info.applicationInfo.map((appInfo) => {
            const appId = typeof appInfo === 'number' ? appInfo : appInfo.id;
            const application = applicationMap.get(appId);

            return {
              sef_id: info.sef_id,
              email: info.email,
              first_name: info.first_name,
              middle_name: info.middle_name,
              last_name: info.last_name,
              mother_maiden_first: info.mother_maiden_first,
              mother_maiden_last: info.mother_maiden_last,
              gender: info.gender,
              dob: info.dob,
              mobile: info.mobile,
              country_origin: info.country_origin,
              country_residence: info.country_residence,
              residency_status: info.residency_status,
              district: info.district,
              governate: info.governate,
              marital_status: info.marital_status,
              type_of_disability: info.type_of_disability,
              disability: info.disability,
              employment_situation: info.employment_situation,
              which_social: info.which_social,
              terms_conditions: info.terms_conditions,
              degree_type: info.degree_type,
              status: info.status,
              institution: info.institution,
              field_of_study: info.field_of_study,
              major_title: info.major_title,
              createdAt: info.created_at,
              program_id:
                application?.applicationProgram?.[0]?.program.id || '',
              program_name:
                application?.applicationProgram?.[0]?.program.program_name ||
                '',
              abbreviation:
                application?.applicationProgram?.[0]?.program.abbreviation ||
                '',
              passed_screening: application?.passed_screening || '',
              passed_screening_date: application?.passed_screening_date || '',
              passed_exam: application?.passed_exam || '',
              passed_exam_date: application?.passed_exam_date || '',
              passed_interview_date: application?.passed_interview_date || '',
              passed_interview: application?.passed_interview || '',
              appStatus: application?.status || '',
              remarks: application?.remarks || '',
              extras: application?.extras || '',
            };
          });
        } else {
          return [
            {
              sef_id: info.sef_id,
              email: info.email,
              first_name: info.first_name,
              middle_name: info.middle_name,
              last_name: info.last_name,
              mother_maiden_first: info.mother_maiden_first,
              mother_maiden_last: info.mother_maiden_last,
              gender: info.gender,
              dob: info.dob,
              mobile: info.mobile,
              country_origin: info.country_origin,
              country_residence: info.country_residence,
              residency_status: info.residency_status,
              district: info.district,
              governate: info.governate,
              marital_status: info.marital_status,
              type_of_disability: info.type_of_disability,
              disability: info.disability,
              employment_situation: info.employment_situation,
              which_social: info.which_social,
              terms_conditions: info.terms_conditions,
              degree_type: info.degree_type,
              status: info.status,
              institution: info.institution,
              field_of_study: info.field_of_study,
              major_title: info.major_title,
              createdAt: info.created_at,
              program_id: '',
              program_name: '',
              abbreviation: '',
              passed_screening: '',
              passed_screening_date: '',
              passed_exam: '',
              passed_exam_date: '',
              passed_interview_date: '',
              passed_interview: '',
              enrolled: '',
              remarks: '',
              extras: '',
            },
          ];
        }
      });

      combinedData.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      return {
        data: combinedData,
      };
    });
  };

  usersReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate } = filtersDto;

      const whereConditions: any = {};

      if (fromDate && toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999); // Set to the end of the day
        whereConditions.created_at = Between(fromDate, adjustedToDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999);
        whereConditions.created_at = LessThanOrEqual(adjustedToDate);
      }

      const users = await this.userService.findMany(whereConditions);

      throwNotFound({
        entity: 'usersReport',
        errorCheck: !users,
      });

      const sortedUsers = users.map((user) => ({
        sef_id: user.sef_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        createdAt: user.created_at,
      }));

      sortedUsers.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      return {
        data: sortedUsers,
      };
    });
  };

  microcampApplicationsReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate, microcampId } = filtersDto;

      const whereConditions: any = {};
      const options: GlobalEntities[] = ['applicationMicrocamp'];

      if (fromDate && toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999); // Set to the end of the day
        whereConditions.created_at = Between(fromDate, adjustedToDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        const adjustedToDate = new Date(toDate);
        adjustedToDate.setHours(23, 59, 59, 999);
        whereConditions.created_at = LessThanOrEqual(adjustedToDate);
      }
      if (microcampId) {
        if (!whereConditions.applicationMicrocamp) {
          whereConditions.applicationMicrocamp = {};
        }

        whereConditions.applicationMicrocamp.microcampId = microcampId;
      }

      const microcampApplications =
        await this.microcampApplicationService.findMany(
          whereConditions,
          options,
        );

      throwNotFound({
        entity: 'microcampApplicationsReport',
        errorCheck: !microcampApplications,
      });

      const mappedMicrocampApplications = microcampApplications.map(
        (microcampApplication) => ({
          'Full Name': microcampApplication.full_name,
          'Enrolled Micrcamp':
            microcampApplication.applicationMicrocamp.microcamp.name,
          email: microcampApplication.email,
          'Phone Number': microcampApplication.phone_number,
          'Country Of Residence': microcampApplication.country_residence,
          'Age Range': microcampApplication.age_range,
          'Referral Source': microcampApplication.referral_source,
          'Created At': microcampApplication.created_at,
        }),
      );

      mappedMicrocampApplications.sort(
        (a, b) =>
          new Date(a['Created At']).getTime() -
          new Date(b['Created At']).getTime(),
      );

      return { data: mappedMicrocampApplications };
    });
  };
}
