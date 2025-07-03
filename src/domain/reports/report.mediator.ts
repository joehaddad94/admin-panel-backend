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
        'SEF ID': app.applicationUser[0].user.sef_id,
        'Username': app.applicationUser[0].user.username,
        'Email': app.applicationUser[0].user.email,
        'First Name': app.applicationInfo[0].info.first_name,
        'Middle Name': app.applicationInfo[0].info.middle_name,
        'Last Name': app.applicationInfo[0].info.last_name,
        'Mother Maiden First Name': app.applicationInfo[0].info.mother_maiden_first,
        'Mother Maiden Last Name': app.applicationInfo[0].info.mother_maiden_last,
        'Gender': app.applicationInfo[0].info.gender,
        'Date of Birth': app.applicationInfo[0].info.dob,
        'Mobile Number': app.applicationInfo[0].info.mobile,
        'Country of Origin': app.applicationInfo[0].info.country_origin,
        'Country of Residence': app.applicationInfo[0].info.country_residence,
        'Residency Status': app.applicationInfo[0].info.residency_status,
        'District': app.applicationInfo[0].info.district,
        'Governate': app.applicationInfo[0].info.governate,
        'Marital Status': app.applicationInfo[0].info.marital_status,
        'Type of Disability': app.applicationInfo[0].info.type_of_disability,
        'Disability': app.applicationInfo[0].info.disability,
        'Employment Situation': app.applicationInfo[0].info.employment_situation,
        'Social Media Platform': app.applicationInfo[0].info.which_social,
        'Terms and Conditions Accepted': app.applicationInfo[0].info.terms_conditions,
        'Degree Type': app.applicationInfo[0].info.degree_type,
        'Status': app.applicationInfo[0].info.status,
        'Institution': app.applicationInfo[0].info.institution,
        'Field of Study': app.applicationInfo[0].info.field_of_study,
        'Major Title': app.applicationInfo[0].info.major_title,
        'Information Created At': app.applicationInfo[0].info.created_at,
        'Program Name': app.applicationProgram[0].program.program_name,
        'Program Abbreviation': app.applicationProgram[0].program.abbreviation,
        'Application Created At': app.created_at,
        'Is Eligible': app.is_eligible,
        'Passed Screening': app.passed_screening,
        'Screening Pass Date': app.passed_screening_date,
        'Screening Email Sent': app.screening_email_sent,
        'Exam Score': app.exam_score,
        'Passed Exam': app.passed_exam,
        'Exam Pass Date': app.passed_exam_date,
        'Exam Email Sent': app.passed_exam_email_sent,
        'Technical Interview Score': app.tech_interview_score,
        'Soft Skills Interview Score': app.soft_interview_score,
        'Passed Interview': app.passed_interview,
        'Interview Pass Date': app.passed_interview_date,
        'Remarks': app.remarks,
        'Application Status': app.status,
        'Status Email Sent': app.status_email_sent,
        'Additional Information': app.extras,
      }));
      
      mappedApplications.sort(
        (a, b) =>
          new Date(a['Application Created At']).getTime() -
          new Date(b['Application Created At']).getTime(),
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
              'SEF ID': info.sef_id,
              'Email': info.email,
              'First Name': info.first_name,
              'Middle Name': info.middle_name,
              'Last Name': info.last_name,
              'Mother Maiden First Name': info.mother_maiden_first,
              'Mother Maiden Last Name': info.mother_maiden_last,
              'Gender': info.gender,
              'Date of Birth': info.dob,
              'Mobile Number': info.mobile,
              'Country of Origin': info.country_origin,
              'Country of Residence': info.country_residence,
              'Residency Status': info.residency_status,
              'District': info.district,
              'Governate': info.governate,
              'Marital Status': info.marital_status,
              'Type of Disability': info.type_of_disability,
              'Disability': info.disability,
              'Employment Situation': info.employment_situation,
              'Social Media Platform': info.which_social,
              'Terms and Conditions Accepted': info.terms_conditions,
              'Degree Type': info.degree_type,
              'Status': info.status,
              'Institution': info.institution,
              'Field of Study': info.field_of_study,
              'Major Title': info.major_title,
              'Created At': info.created_at,
              'Program ID': application?.applicationProgram?.[0]?.program.id || '',
              'Program Name': application?.applicationProgram?.[0]?.program.program_name || '',
              'Program Abbreviation': application?.applicationProgram?.[0]?.program.abbreviation || '',
              'Passed Screening': application?.passed_screening || '',
              'Screening Pass Date': application?.passed_screening_date || '',
              'Passed Exam': application?.passed_exam || '',
              'Exam Pass Date': application?.passed_exam_date || '',
              'Interview Pass Date': application?.passed_interview_date || '',
              'Passed Interview': application?.passed_interview || '',
              'Application Status': application?.status || '',
              'Remarks': application?.remarks || '',
              'Additional Information': application?.extras || '',
            };
          });
        } else {
          return [
            {
              'SEF ID': info.sef_id,
              'Email': info.email,
              'First Name': info.first_name,
              'Middle Name': info.middle_name,
              'Last Name': info.last_name,
              'Mother Maiden First Name': info.mother_maiden_first,
              'Mother Maiden Last Name': info.mother_maiden_last,
              'Gender': info.gender,
              'Date of Birth': info.dob,
              'Mobile Number': info.mobile,
              'Country of Origin': info.country_origin,
              'Country of Residence': info.country_residence,
              'Residency Status': info.residency_status,
              'District': info.district,
              'Governate': info.governate,
              'Marital Status': info.marital_status,
              'Type of Disability': info.type_of_disability,
              'Disability': info.disability,
              'Employment Situation': info.employment_situation,
              'Social Media Platform': info.which_social,
              'Terms and Conditions Accepted': info.terms_conditions,
              'Degree Type': info.degree_type,
              'Status': info.status,
              'Institution': info.institution,
              'Field of Study': info.field_of_study,
              'Major Title': info.major_title,
              'Created At': info.created_at,
              'Program ID': '',
              'Program Name': '',
              'Program Abbreviation': '',
              'Passed Screening': '',
              'Screening Pass Date': '',
              'Passed Exam': '',
              'Exam Pass Date': '',
              'Interview Pass Date': '',
              'Passed Interview': '',
              'Application Status': '',
              'Remarks': '',
              'Additional Information': '',
            },
          ];
        }
      });

      combinedData.sort(
        (a, b) =>
          new Date(a['Created At']).getTime() - new Date(b['Created At']).getTime(),
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
        'SEF ID': user.sef_id,
        'Username': user.username,
        'Email': user.email,
        'First Name': user.first_name,
        'Last Name': user.last_name,
        'Created At': user.created_at,
      }));

      sortedUsers.sort(
        (a, b) =>
          new Date(a['Created At']).getTime() - new Date(b['Created At']).getTime(),
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
