import { Injectable } from '@nestjs/common';
import { catcher } from '@core/helpers/operation';
import { ApplicationService } from '@domain/applications/application.service';
import { InformationService } from '@domain/information/information.service';
import { UserService } from '@domain/users/user.service';
import { throwNotFound } from '@core/settings/base/errors/errors';
import { GlobalEntities } from '@core/data/types';
import { FiltersDto } from './dtos/filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '@core/data/database/entities/application.entity';
import { ApplicationRepository } from '@domain/applications/application.repository';
import { Between, Filter, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ReportMediator {
  constructor(
    private readonly informationService: InformationService,

    @InjectRepository(Application)
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationService: ApplicationService,

    private readonly userService: UserService,
  ) {}

  applicationReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate, programId } = filtersDto;
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
        enrolled: app.enrolled,
        remarks: app.remarks,
        extras: app.extras,
      }));

      return mappedApplications;
    });
  };

  informationReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate } = filtersDto;
      const options: GlobalEntities[] = ['applicationInfo', 'informationUser'];
      const whereConditions: any = {};

      if (fromDate && toDate) {
        whereConditions.created_at = Between(fromDate, toDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereConditions.created_at = LessThanOrEqual(toDate);
      }

      const information = await this.informationService.findMany(
        whereConditions,
        options,
      );

      throwNotFound({
        entity: 'informationReport',
        errorCheck: !information,
      });

      return information;
    });
  };

  usersReport = async (filtersDto: FiltersDto) => {
    return catcher(async () => {
      const { fromDate, toDate } = filtersDto;
      const whereConditions: any = {};

      if (fromDate && toDate) {
        whereConditions.created_at = Between(fromDate, toDate);
      } else if (fromDate) {
        whereConditions.created_at = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereConditions.created_at = LessThanOrEqual(toDate);
      }

      const users = await this.userService.findMany(whereConditions);

      throwNotFound({
        entity: 'usersReport',
        errorCheck: !users,
      });

      return users;
    });
  };
}
