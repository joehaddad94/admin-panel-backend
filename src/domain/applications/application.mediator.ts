/* eslint-disable camelcase */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { GlobalEntities } from '../../core/data/types';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';
import { FiltersDto } from '../reports/dtos/filters.dto';
import { SendingEmailsDto } from './dtos/sending.emails.dto';
import { CycleService } from '../cycles/cycle.service';
import { throwError } from 'src/core/settings/base/errors/base.error';
import { MailService } from '../mail/mail.service';
import { ExamScoresDto } from './dtos/exam.scores.dto';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { EditApplicationsDto } from './dtos/edit.applications.dto';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { FindOptionsWhere, UpdateDateColumn } from 'typeorm';
import { Application } from 'src/core/data/database/entities/application.entity';
import { ApplicationCycle } from 'src/core/data/database/relations/application-cycle.entity';
import { validateThresholdEntity } from 'src/core/helpers/validateThresholds';
import { Status } from 'src/core/data/types/applications/applications.types';

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
      const {
        id,
        examScore,
        techInterviewScore,
        softInterviewScore,
        status,
        cycleId,
      } = data;

      const options: GlobalEntities[] = ['thresholdCycle'];

      const cycle = await this.cyclesService.findOne(
        {
          id: cycleId,
        },
        options,
      );

      if (!cycle) {
        throwError('Cycle is not found', HttpStatus.BAD_REQUEST);
      }

      if (!cycle.thresholdCycle || !cycle.thresholdCycle.threshold) {
        throwError(
          'Please provide thresholds for this cycle',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        validateThresholdEntity(cycle.thresholdCycle.threshold);
      }

      const application = await this.applicationsService.findOne({ id });

      throwNotFound({
        entity: 'application',
        errorCheck: !application,
      });

      const updatedData: any = {};

      const properties = {
        exam_score: examScore,
        tech_interview_score: techInterviewScore,
        soft_interview_score: softInterviewScore,
        status: status,
      };

      for (const [key, value] of Object.entries(properties)) {
        if (value !== undefined) {
          updatedData[key] = value;
        }
      }

      if (
        cycle.thresholdCycle.threshold.exam_passing_grade !== undefined &&
        cycle.thresholdCycle.threshold.exam_passing_grade !== null &&
        cycle.thresholdCycle.threshold.exam_passing_grade !== 0 &&
        updatedData.exam_score !== undefined
      ) {
        if (
          updatedData.exam_score >=
          cycle.thresholdCycle.threshold.exam_passing_grade
        ) {
          updatedData.passed_exam = true;
          updatedData.passed_exam_date = new Date();
        } else {
          updatedData.passed_exam = false;
          updatedData.passed_exam_date = new Date();
        }
      }

      if (
        softInterviewScore !== undefined &&
        techInterviewScore !== undefined &&
        cycle.thresholdCycle.threshold.weight_tech !== undefined &&
        cycle.thresholdCycle.threshold.weight_soft !== undefined &&
        cycle.thresholdCycle.threshold.weight_tech !== null &&
        cycle.thresholdCycle.threshold.weight_soft !== null &&
        cycle.thresholdCycle.threshold.weight_tech !== 0 &&
        cycle.thresholdCycle.threshold.weight_soft !== 0
      ) {
        const interviewGrade =
          (cycle.thresholdCycle.threshold.weight_tech * techInterviewScore +
            cycle.thresholdCycle.threshold.weight_soft * softInterviewScore) /
          2;

        if (
          interviewGrade >= cycle.thresholdCycle.threshold.primary_passing_grade
        ) {
          updatedData.passed_interview = true;
          updatedData.status = Status.ACCEPTED;
        } else if (
          interviewGrade >=
          cycle.thresholdCycle.threshold.secondary_passing_grade
        ) {
          updatedData.passed_interview = true;
          updatedData.status = Status.WAITING_LIST;
        } else {
          updatedData.passed_interview = false;
          updatedData.status = Status.REJECTED;
        }
        updatedData.passed_interview_date = new Date();
      }

      updatedData.updated_at = new Date();

      await this.applicationsService.update({ id }, updatedData);

      const updatedPayload = convertToCamelCase(updatedData);

      return {
        message: 'Application updated successfully.',
        updatedPayload,
      };
    });
  };

  sendPostScreeningEmails = async (data: SendingEmailsDto) => {
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
        mailerResponse = this.mailService.sendEmails(
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
    const { cycleId, examScores } = data;

    try {
      const cycle = await this.cyclesService.findOne(
        {
          id: cycleId,
        },
        ['thresholdCycle'],
      );

      if (!cycle) {
        throwError('Cycle not found.', HttpStatus.BAD_REQUEST);
      }

      if (
        !cycle.thresholdCycle ||
        !cycle.thresholdCycle.threshold ||
        cycle.thresholdCycle.threshold.exam_passing_grade === null ||
        cycle.thresholdCycle.threshold.exam_passing_grade === undefined ||
        cycle.thresholdCycle.threshold.exam_passing_grade === 0
      ) {
        throwError(
          'Exam Passing Grade must be provided.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const applicationsWhereConditions = cycleId
        ? { applicationCycle: { cycleId } }
        : {};

      const applicationsByCycle = await this.applicationsService.findMany(
        applicationsWhereConditions,
        ['applicationInfo'],
      );

      const applicationsMap = new Map(
        applicationsByCycle.map((app) => [
          app.applicationInfo[0].info.email,
          {
            id: app.id,
            passed_screening: app.passed_screening,
          },
        ]),
      );

      const updateResults = await Promise.all(
        examScores.map(async ({ email, score }) => {
          const application = applicationsMap.get(email);
          if (application && application.passed_screening) {
            let passed_exam = false;
            const passed_exam_date = new Date();

            if (score >= cycle.thresholdCycle.threshold.exam_passing_grade) {
              passed_exam = true;
            }

            await this.applicationsService.update(
              { id: application.id },
              {
                exam_score: score,
                passed_exam,
                passed_exam_date,
              },
            );
            return { id: application.id, score, passed_exam, passed_exam_date };
          }
          return null;
        }),
      );

      const updatedData = updateResults.filter((result) => result !== null);

      return { message: 'Exam scores imported successfully.', updatedData };
    } catch (error) {
      console.error('Error importing exam scores:', error);
      throwError(
        'Error importing exam scores: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  sendInterviewDateEmails = async (data: SendingEmailsDto) => {
    const { cycleId, emails } = data;

    const cyclesWhereConditions = cycleId ? { id: cycleId } : {};

    const currentCycle = await this.cyclesService.findOne(
      cyclesWhereConditions,
      ['decisionDateCycle'],
    );

    if (!currentCycle) {
      throwError('Cycle not found.', HttpStatus.BAD_REQUEST);
    }

    const interviewMeetLink =
      currentCycle.decisionDateCycle?.decisionDate?.interview_meet_link;

    if (!interviewMeetLink) {
      throwError(
        'Interview meet link should be provided before sending emails.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const uniqueEmails: string[] = [...new Set(emails)];

    const applicationsWhereConditions = cycleId
      ? { applicationCycle: { cycleId } }
      : {};

    const applicationsByCycle = await this.applicationsService.findMany(
      applicationsWhereConditions,
      ['applicationUser'],
    );

    const emailsToSend = applicationsByCycle
      .filter((application) => {
        const email: string = application.applicationUser[0]?.user?.email;
        return uniqueEmails.includes(email) && application.passed_exam;
      })
      .map((application) => application.applicationUser[0].user.email);

    let mailerResponse: any = { foundEmails: [], notFoundEmails: [] };
    if (emailsToSend.length > 0) {
      const subject = 'SE Factory Screening Process';
      const templateName = 'interview-mail.hbs';
      const templateVariables = { interviewMeetLink };
      mailerResponse = await this.mailService.sendEmails(
        emailsToSend,
        templateName,
        subject,
        templateVariables,
      );
    }

    return {
      message: 'Emails sent successfully.',
      foundEmails: mailerResponse.foundEmails,
      notFoundEmails: mailerResponse.notFoundEmails,
    };
  };
}
