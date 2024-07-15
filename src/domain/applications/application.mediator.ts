/* eslint-disable camelcase */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { GlobalEntities } from '../../core/data/types';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';
import { FiltersDto } from '../reports/dtos/filters.dto';
import { PostScreeningDto } from './dtos/post.screening.dto';
import { CycleService } from '../cycles/cycle.service';
import { throwError } from 'src/core/settings/base/errors/base.error';
import { MailService } from '../mail/mail.service';
import { ExamScoresDto } from './dtos/exam.scores.dto';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { EditApplicationsDto } from './dtos/edit.applications.dto';

@Injectable()
export class ApplicationMediator {
  constructor(
    private readonly applicationsService: ApplicationService,
    private readonly cyclesService: CycleService,
    private readonly mailService: MailService,
  ) {}

  findApplications = async (
    filtersDto: FiltersDto,
    page = 1,
    pageSize = 100,
  ) => {
    return catcher(async () => {
      const {
        programId,
        page: dtoPage,
        pageSize: dtoPageSize,
        cycleId,
      } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
        'applicationCycle',
      ];

      const whereConditions: any = {};

      if (programId) {
        if (whereConditions.applicationProgram === undefined) {
          whereConditions.applicationProgram = {};
        }
        whereConditions.applicationProgram.programId = programId;
      } else if (cycleId) {
        if (whereConditions.applicationCycle === undefined) {
          whereConditions.applicationCycle = {};
        }
        whereConditions.applicationCycle.cycleId = cycleId;
      }

      const [applications, total] = await this.applicationsService.findAndCount(
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
        id: app.id,
        sefId: app.applicationUser[0].user.sef_id,
        username: app.applicationUser[0].user.username,
        email: app.applicationUser[0].user.email,
        firstName: app.applicationInfo[0].info.first_name,
        middleName: app.applicationInfo[0].info.middle_name,
        lastName: app.applicationInfo[0].info.last_name,
        motherMaidenFirst: app.applicationInfo[0].info.mother_maiden_first,
        motherMaidenLast: app.applicationInfo[0].info.mother_maiden_last,
        gender: app.applicationInfo[0].info.gender,
        dob: app.applicationInfo[0].info.dob,
        mobile: app.applicationInfo[0].info.mobile,
        countryOrigin: app.applicationInfo[0].info.country_origin,
        countryResidence: app.applicationInfo[0].info.country_residence,
        residencyStatus: app.applicationInfo[0].info.residency_status,
        district: app.applicationInfo[0].info.district,
        governate: app.applicationInfo[0].info.governate,
        maritalStatus: app.applicationInfo[0].info.marital_status,
        typeOfDisability: app.applicationInfo[0].info.type_of_disability,
        disability: app.applicationInfo[0].info.disability,
        employmentSituation: app.applicationInfo[0].info.employment_situation,
        whichSocial: app.applicationInfo[0].info.which_social,
        termsConditions: app.applicationInfo[0].info.terms_conditions,
        degreeType: app.applicationInfo[0].info.degree_type,
        status: app.applicationInfo[0].info.status,
        institution: app.applicationInfo[0].info.institution,
        fieldOfStudy: app.applicationInfo[0].info.field_of_study,
        majorTitle: app.applicationInfo[0].info.major_title,
        infoCreatedAt: app.applicationInfo[0].info.created_at,
        programName: app.applicationProgram[0].program.program_name,
        program: app.applicationProgram[0].program.abbreviation,
        passedScreening: app.passed_screening,
        applicationDate: new Date(app.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        elligible:
          app.is_eligible === true
            ? 'Yes'
            : app.is_eligible === false
            ? 'No'
            : '-',
        passedScreeningDate: app.passed_screening_date,
        examScore: app.exam_score,
        passedExam: app.passed_exam,
        passedExamDate: app.passed_exam_date,
        passedInterviewDate: app.passed_interview_date,
        passedInterview: app.passed_interview,
        applicationStatus: app.status,
        remarks: app.remarks,
        extras: app.extras,
      }));

      mappedApplications.sort(
        (a, b) =>
          new Date(a.applicationDate).getTime() -
          new Date(b.applicationDate).getTime(),
      );

      return {
        applications: mappedApplications,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      };
    });
  };

  editApplications = async (data: EditApplicationsDto) => {
    return catcher(async () => {
      const { id, examScore, techInterviewScore, softInterviewScore, status } =
        data;

      const application = await this.applicationsService.findOne({ id });

      throwNotFound({
        entity: 'application',
        errorCheck: !application,
      });

      const updatedData: any = {};

      if (examScore !== undefined) {
        updatedData.exam_score = examScore;
      }

      if (techInterviewScore !== undefined) {
        updatedData.tech_interview_score = techInterviewScore;
      }

      if (softInterviewScore !== undefined) {
        updatedData.soft_interview_score = softInterviewScore;
      }

      if (status !== undefined) {
        updatedData.status = status;
      }

      await this.applicationsService.update({ id }, updatedData);

      return {
        message: 'Application updated successfully.',
        updatedData,
      };
    });
  };

  sendPostScreeningEmails = async (data: PostScreeningDto) => {
    return catcher(async () => {
      const { cycleId, emails } = data;

      const cyclesWhereConditions = cycleId ? { id: cycleId } : {};

      const currentCycle = await this.cyclesService.findOne(
        cyclesWhereConditions,
        ['decisionDateCycle'],
      );

      if (currentCycle.decisionDateCycle.decisionDate.exam_date === null) {
        throwError('Exam Date should be provided.', HttpStatus.BAD_REQUEST);
      }

      const uniqueEmails: string[] = [...new Set(emails)];

      const applicationsWhereConditions = cycleId
        ? {
            applicationCycle: { cycleId },
          }
        : {};

      const applicationsByCycle = await this.applicationsService.findMany(
        applicationsWhereConditions,
        ['applicationInfo'],
      );

      const applicationsToEmail = [];

      for (const application of applicationsByCycle) {
        const email: string = application.applicationUser[0].user.email;
        if (
          uniqueEmails.includes(email) &&
          application.is_eligible &&
          !application.passed_screening
        ) {
          application.passed_screening = true;
          await this.applicationsService.update(
            { id: application.id },
            {
              passed_screening: true,
              passed_screening_date: new Date(),
            },
          );
          applicationsToEmail.push(application);
        }
      }

      const emailsToSend = applicationsToEmail.map(
        (app) => app.applicationUser[0].user.email,
      );

      let mailerResponse: any;
      if (emailsToSend.length > 0) {
        const subject = 'SE Factory Screening Process';
        const templateName = 'invitation.hbs';
        mailerResponse = this.mailService.sendScreeningProcessEmail(
          emailsToSend,
          templateName,
          subject,
        );
      }

      return {
        message: 'Emails sent successfully.',
        foundEmails: mailerResponse?.foundEmails || [],
        notFoundEmails: mailerResponse?.notFoundEmails || [],
      };
    });
  };

  importExamScores = async (data: ExamScoresDto) => {
    const { sourceFilePath, cycleId } = data;

    try {
      const fileExtension = path.extname(sourceFilePath).toLowerCase();
      if (fileExtension !== '.xls' && fileExtension !== '.xlsx') {
        throwError(
          'Invalid file type. Only Excel files are allowed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const workbook = XLSX.readFile(sourceFilePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const examScores = XLSX.utils.sheet_to_json<{
        email: string;
        score: number;
      }>(worksheet);

      const applicationsWhereConditions = cycleId
        ? {
            applicationCycle: { cycleId },
          }
        : {};

      const applicationsByCycle = await this.applicationsService.findMany(
        applicationsWhereConditions,
        ['applicationInfo'],
      );

      const applicationsMap = new Map(
        applicationsByCycle.map((app) => [
          app.applicationInfo[0].info.email,
          app.id,
        ]),
      );

      for (const { email, score } of examScores) {
        const applicationId = applicationsMap.get(email);
        if (applicationId) {
          await this.applicationsService.update(
            { id: applicationId },
            {
              exam_score: score,
            },
          );
        }
      }

      return { message: 'Exam scores imported successfully.' };
    } catch (error) {
      throwError(
        'Error importing exam scores: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
}
