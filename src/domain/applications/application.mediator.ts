/* eslint-disable camelcase */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { EditApplicationsDto } from './dtos/edit.applications.dto';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { validateThresholdEntity } from 'src/core/helpers/validateThresholds';
import { Status } from 'src/core/data/types/applications/applications.types';
import {
  formatExamDate,
  formatReadableDate,
} from 'src/core/helpers/formatDate';
import {
  calculatePassedExam,
  calculatePassedInterview,
} from 'src/core/helpers/calculatePassingGrades';
import { In } from 'typeorm';
import { InterviewScoresDto } from './dtos/interview.scores.dto';

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
    pageSize = 10000000,
  ) => {
    return catcher(async () => {
      const {
        programId,
        page: dtoPage,
        pageSize: dtoPageSize,
        cycleId,
      } = filtersDto;
      console.log(
        '🚀 ~ ApplicationMediator ~ returncatcher ~ programId:',
        programId,
      );
      console.log(
        '🚀 ~ ApplicationMediator ~ returncatcher ~ cycleId:',
        cycleId,
      );

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;
      let latestCycle;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
        'applicationCycle',
      ];

      const whereConditions: any = {};

      if (programId) {
        if (!whereConditions.applicationProgram) {
          whereConditions.applicationProgram = {};
        }
        whereConditions.applicationProgram.programId = programId;
      }

      if (cycleId) {
        if (!whereConditions.applicationCycle) {
          whereConditions.applicationCycle = {};
        }
        whereConditions.applicationCycle.cycleId = cycleId;
        console.log(
          '🚀 ~ ApplicationMediator ~ returncatcher ~ whereConditions:',
          whereConditions,
        );
      } else if (cycleId) {
        latestCycle = await this.applicationsService.getLatestCycle(programId);
        console.log(
          '🚀 ~ ApplicationMediator ~ returncatcher ~ latestCycle:',
          latestCycle,
        );
        if (latestCycle) {
          if (!whereConditions.applicationCycle) {
            whereConditions.applicationCycle = {};
          }
          whereConditions.applicationCycle.cycleId = latestCycle.id;
        }
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
        screeningEmailSent:
          app.screening_email_sent === true
            ? 'Yes'
            : app.screening_email_sent === false
            ? 'No'
            : '-',
        applicationDate: new Date(app.created_at),
        eligible:
          app.is_eligible === true
            ? 'Yes'
            : app.is_eligible === false
            ? 'No'
            : '-',
        passedScreeningDate: new Date(app.passed_screening_date),
        examScore: app.exam_score,
        passedExam: app.passed_exam,
        passedExamDate: new Date(app.passed_exam_date),
        passedExamEmailSent:
          app.passed_exam_email_sent === true
            ? 'Yes'
            : app.passed_exam_email_sent === false
            ? 'No'
            : '-',
        techInterviewScore: app.tech_interview_score,
        softInterviewScore: app.soft_interview_score,
        passedInterviewDate: new Date(app.passed_interview_date),
        passedInterview: app.passed_interview,
        applicationStatus: app.status,
        statusEmailSent:
          app.status_email_sent === true
            ? 'Yes'
            : app.status_email_sent === false
            ? 'No'
            : '-',
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
        latestCycle,
      };
    });
  };

  findApplicationsByLatestCycle = async (
    filtersDto: FiltersDto,
    page = 1,
    pageSize = 10000000,
  ) => {
    return catcher(async () => {
      const { programId, page: dtoPage, pageSize: dtoPageSize } = filtersDto;

      const relevantCycle = await this.applicationsService.getRelevantCycleId(
        programId,
      );

      let relevantCycleId = relevantCycle.id;

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
      }

      if (relevantCycleId) {
        if (whereConditions.applicationCycle === undefined) {
          whereConditions.applicationCycle = {};
        }
        whereConditions.applicationCycle.cycleId = relevantCycleId;
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
        passedScreening:
          app.passed_screening === true
            ? 'Yes'
            : app.passed_screening === false
            ? 'No'
            : '-',
        screeningEmailSent:
          app.screening_email_sent === true
            ? 'Yes'
            : app.screening_email_sent === false
            ? 'No'
            : '-',
        applicationDate: new Date(app.created_at),
        eligible:
          app.is_eligible === true
            ? 'Yes'
            : app.is_eligible === false
            ? 'No'
            : '-',
        passedScreeningDate: new Date(app.passed_screening_date),
        examScore: app.exam_score,
        passedExam:
          app.passed_exam === true
            ? 'Yes'
            : app.passed_exam === false
            ? 'No'
            : '-',
        passedExamDate: new Date(app.passed_exam_date),
        passedExamEmailSent:
          app.passed_exam_email_sent === true
            ? 'Yes'
            : app.passed_exam_email_sent === false
            ? 'No'
            : '-',
        techInterviewScore: app.tech_interview_score,
        softInterviewScore: app.soft_interview_score,
        passedInterviewDate: new Date(app.passed_interview_date),
        passedInterview:
          app.passed_interview === true
            ? 'Yes'
            : app.passed_interview === false
            ? 'No'
            : '-',
        applicationStatus: app.status,
        statusEmailSent:
          app.status_email_sent === true
            ? 'Yes'
            : app.status_email_sent === false
            ? 'No'
            : '-',
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
        relevantCycleName: relevantCycle.name,
        relevantCycleId: relevantCycle.id,
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
        remarks,
        applicationStatus,
        cycleId,
      } = data;

      const application = await this.applicationsService.findOne({ id });
      throwNotFound({ entity: 'application', errorCheck: !application });

      const { is_eligible, passed_screening, screening_email_sent } =
        application;

      if (!is_eligible || !passed_screening || !screening_email_sent) {
        throwError(
          'Application cannot be edited. Ensure it meets the eligibility and screening criteria.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const options: GlobalEntities[] = ['thresholdCycle'];
      const cycle = await this.cyclesService.findOne({ id: cycleId }, options);

      if (!cycle) {
        throwError('Cycle is not found', HttpStatus.BAD_REQUEST);
      }

      const { thresholdCycle } = cycle;
      if (!thresholdCycle || !thresholdCycle.threshold) {
        throwError(
          'Please provide thresholds for this cycle',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        validateThresholdEntity(thresholdCycle.threshold);
      }

      const updatedData: any = {
        exam_score:
          examScore !== 0 ? examScore : Number(application.exam_score),
        tech_interview_score:
          techInterviewScore !== 0
            ? techInterviewScore
            : Number(application.tech_interview_score),
        soft_interview_score:
          softInterviewScore !== 0
            ? softInterviewScore
            : Number(application.soft_interview_score),
        remarks: remarks !== '' ? remarks : application.remarks,
        status: applicationStatus,
        updated_at: new Date(),
      };

      const { threshold } = thresholdCycle;

      if (examScore !== undefined) {
        const { passedExam, passedExamDate } = calculatePassedExam(
          updatedData.exam_score,
          threshold.exam_passing_grade,
        );

        updatedData.passed_exam = passedExam;
        updatedData.passed_exam_date = passedExamDate;
      }

      const techScoreToUse =
        techInterviewScore ?? application.tech_interview_score;
      const softScoreToUse =
        softInterviewScore ?? application.soft_interview_score;

      let recalculatedStatus = updatedData.status;

      const skipStatusUpdate =
        applicationStatus !== undefined &&
        (applicationStatus !== application.status ||
          application.status === null);

      if (!skipStatusUpdate) {
        if (techScoreToUse && softScoreToUse) {
          const {
            passedInterview,
            applicationStatus: calculatedStatus,
            passedInterviewDate,
          } = calculatePassedInterview(
            techScoreToUse,
            softScoreToUse,
            {
              weightTech: threshold.weight_tech,
              weightSoft: threshold.weight_soft,
              primaryPassingGrade: threshold.primary_passing_grade,
              secondaryPassingGrade: threshold.secondary_passing_grade,
            },
            false,
          );

          updatedData.passed_interview = passedInterview;
          updatedData.passed_interview_date = passedInterviewDate;

          recalculatedStatus = calculatedStatus;
        }
      } else {
        updatedData.passed_interview = application.passed_interview;
        updatedData.passed_interview_date = application.passed_interview_date;
        recalculatedStatus = applicationStatus;
      }

      updatedData.status = recalculatedStatus;

      await this.applicationsService.update({ id }, updatedData);

      const updatedPayload = convertToCamelCase({
        ...updatedData,
        passedInterview:
          updatedData.passed_interview === true
            ? 'Yes'
            : updatedData.passed_interview === false
            ? 'No'
            : '-',
        passedInterviewDate: updatedData.passed_interview_date,
        applicationStatus: updatedData.status,
        passedExam:
          updatedData.passed_exam === true
            ? 'Yes'
            : updatedData.passed_exam === false
            ? 'No'
            : '-',
        passedExamEmailSent:
          application.passed_exam_email_sent === true
            ? 'Yes'
            : application.passed_exam_email_sent === false
            ? 'No'
            : '-',
        passedScreening:
          application.passed_screening === true
            ? 'Yes'
            : application.passed_screening === false
            ? 'No'
            : '-',
      });

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

      const requiredFields = [
        {
          field: currentCycle.decisionDateCycle.decisionDate.exam_date,
          message: 'Exam Date and time should be provided.',
        },
        {
          field: currentCycle.decisionDateCycle.decisionDate.exam_link,
          message: 'Exam Link should be provided.',
        },
        {
          field:
            currentCycle.decisionDateCycle.decisionDate
              .info_session_recorded_link,
          message: 'Info Session Recorded Link should be provided.',
        },
      ];

      requiredFields.forEach(({ field, message }) => {
        if (field === null) {
          throwError(message, HttpStatus.BAD_REQUEST);
        }
      });

      const uniqueEmails: string[] = [
        ...new Set(emails.map((entry) => entry.emails)),
      ];

      const applicationsWhereConditions = cycleId
        ? {
            applicationCycle: { cycleId },
          }
        : {};

      const applicationsByCycle = await this.applicationsService.findMany(
        applicationsWhereConditions,
        ['applicationInfo', 'applicationUser'],
      );

      const eligibleApplicationsToEmail = [];
      const ineligibleApplicationsToEmail = [];

      for (const application of applicationsByCycle) {
        const email: string = application.applicationUser[0]?.user?.email;
        if (uniqueEmails.includes(email)) {
          if (application.is_eligible) {
            if (!application.passed_screening) {
              application.passed_screening = true;
              application.passed_screening_date = new Date();
              await this.applicationsService.update(
                { id: application.id },
                {
                  passed_screening: true,
                  passed_screening_date: new Date(),
                },
              );
              eligibleApplicationsToEmail.push({
                ...application,
                passed_screening: 'Yes',
              });
            } else if (!application.screening_email_sent) {
              eligibleApplicationsToEmail.push({
                ...application,
                passed_screening: 'Yes',
              });
            }
          } else {
            application.passed_screening = false;
            application.passed_screening_date = new Date();
            await this.applicationsService.update(
              { id: application.id },
              {
                passed_screening: false,
                passed_screening_date: new Date(),
              },
            );
            ineligibleApplicationsToEmail.push({
              ...application,
              passed_screening: 'No',
            });
          }
        }
      }

      const eligibleEmailsToSend = eligibleApplicationsToEmail.map(
        (app) => app.applicationUser[0]?.user?.email,
      );

      const ineligibleEmailsToSend = ineligibleApplicationsToEmail.map(
        (app) => app.applicationUser[0]?.user?.email,
      );

      const examDate = formatExamDate(
        currentCycle.decisionDateCycle.decisionDate.exam_date,
      );

      let mailerResponseEligible: any;
      let mailerResponseIneligible: any;

      if (eligibleEmailsToSend.length > 0) {
        const subject = 'SE Factory Screening Process';
        const templateName = 'FSE/shortlisted.hbs';
        const templateVariables = {
          examDate: examDate,
          examLink: currentCycle.decisionDateCycle.decisionDate.exam_link,
          infoSessionRecordedLink:
            currentCycle.decisionDateCycle.decisionDate
              .info_session_recorded_link,
        };

        mailerResponseEligible = await this.mailService.sendEmails(
          eligibleEmailsToSend,
          templateName,
          subject,
          templateVariables,
        );
      }

      if (ineligibleEmailsToSend.length > 0) {
        const subject = 'SE Factory Screening Process';
        const templateName = 'FSE/notEligible.hbs';

        mailerResponseIneligible = await this.mailService.sendEmails(
          ineligibleEmailsToSend,
          templateName,
          subject,
        );
      }

      const resultsEligible = mailerResponseEligible?.results || [];
      const resultsIneligible = mailerResponseIneligible?.results || [];

      const sentEmailSetEligible = new Set(
        resultsEligible.filter((res) => !res.error).map((res) => res.email),
      );
      const sentEmailSetIneligible = new Set(
        resultsIneligible.filter((res) => !res.error).map((res) => res.email),
      );

      for (const application of eligibleApplicationsToEmail) {
        const email = application.applicationUser[0]?.user?.email;
        if (sentEmailSetEligible.has(email)) {
          await this.applicationsService.update(
            { id: application.id },
            { screening_email_sent: true },
          );
          application.screening_email_sent = 'Yes';
        } else {
          await this.applicationsService.update(
            { id: application.id },
            { screening_email_sent: false },
          );
          application.screening_email_sent = 'No';
        }
      }

      for (const application of ineligibleApplicationsToEmail) {
        const email = application.applicationUser[0]?.user?.email;
        if (sentEmailSetIneligible.has(email)) {
          await this.applicationsService.update(
            { id: application.id },
            { screening_email_sent: true },
          );
          application.screening_email_sent = 'Yes';
        } else {
          await this.applicationsService.update(
            { id: application.id },
            { screening_email_sent: false },
          );
          application.screening_email_sent = 'No';
        }
      }

      const camelCaseApplications = convertToCamelCase([
        ...eligibleApplicationsToEmail,
        ...ineligibleApplicationsToEmail,
      ]);

      return {
        message: 'Emails have been processed. Check the status for details.',
        eligible: mailerResponseEligible,
        ineligible: mailerResponseIneligible,
        applications: camelCaseApplications,
      };
    });
  };

  importExamScores = async (data: ExamScoresDto) => {
    const { cycleId, examScores } = data;

    try {
      const cycle = await this.cyclesService.findOne({ id: cycleId }, [
        'thresholdCycle',
      ]);

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

      const applicationsByCycle = await this.applicationsService.findMany(
        { applicationCycle: { cycleId } },
        ['applicationInfo'],
      );

      const applicationsMap = new Map();

      applicationsByCycle.forEach((app) => {
        const email = app.applicationInfo[0].info.email;
        if (!applicationsMap.has(email)) {
          applicationsMap.set(email, []);
        }
        applicationsMap.get(email).push({
          id: app.id,
          passed_screening: app.passed_screening,
          screening_email_sent: app.screening_email_sent,
        });
      });

      const updateResults = await Promise.all(
        examScores.map(async ({ email, score }) => {
          const applications = applicationsMap.get(email);

          if (!applications || applications.length === 0) {
            return { email, status: 'Email not found' };
          }

          if (applications.length > 1) {
            Logger.warn(
              `Multiple applications found for email: ${email}. Using the most recent.`,
            );

            applications.sort((a, b) => {
              const dateA = new Date(a.created_at).getTime() || 0;
              const dateB = new Date(b.created_at).getTime() || 0;
              return dateB - dateA;
            });
          }

          const application = applications[0];

          if (
            application.passed_screening &&
            application.screening_email_sent
          ) {
            const passed_exam =
              score >= cycle.thresholdCycle.threshold.exam_passing_grade;
            const passed_exam_date = new Date();

            await this.applicationsService.update(
              { id: application.id },
              {
                exam_score: score,
                passed_exam,
                passed_exam_date,
              },
            );

            return {
              id: application.id,
              email,
              examScore: score,
              passedExam: passed_exam ? 'Yes' : 'No',
              passed_exam_date,
            };
          }

          return { email, status: 'Application not eligible for exam update' };
        }),
      );

      let updatedData = updateResults.filter((result) => result !== null);
      updatedData = convertToCamelCase(updatedData);

      return {
        message: 'Emails have been processed. Check the status for details.',
        updatedData,
        warnings: updateResults.filter((result) => result?.status),
      };
    } catch (error) {
      Logger.error('Error processing exam scores', error.stack);
      throw error;
    }
  };

  importInterviewScores = async (data: InterviewScoresDto) => {
    const { cycleId, interviewScores } = data;

    try {
      const cycle = await this.cyclesService.findOne({ id: cycleId }, [
        'thresholdCycle',
      ]);

      if (!cycle) {
        throwError('Cycle not found.', HttpStatus.BAD_REQUEST);
      }

      if (
        !cycle.thresholdCycle?.threshold ||
        [
          cycle.thresholdCycle.threshold.weight_tech,
          cycle.thresholdCycle.threshold.primary_passing_grade,
          cycle.thresholdCycle.threshold.secondary_passing_grade,
        ].some((value) => value == null || value === 0)
      ) {
        throwError('All thresholds must be provided.', HttpStatus.BAD_REQUEST);
      }

      const applicationsByCycle = await this.applicationsService.findMany(
        { applicationCycle: { cycleId } },
        ['applicationInfo'],
      );

      const applicationsMap = new Map();

      applicationsByCycle.forEach((app) => {
        const email = app.applicationInfo[0].info.email;
        if (!applicationsMap.has(email)) {
          applicationsMap.set(email, []);
        }
        applicationsMap.get(email).push({
          id: app.id,
          passed_exam: app.passed_exam,
          passed_exam_email_sent: app.passed_exam_email_sent,
        });
      });

      const updatedResults = await Promise.all(
        interviewScores.map(
          async ({ email, techScore, softScore, remarks }) => {
            const applications = applicationsMap.get(email);

            if (!applications || applications.length === 0) {
              return {
                email,
                techScore,
                softScore,
                remarks: 'Email not found',
              };
            }

            if (applications.length > 1) {
              Logger.warn(
                `Multiple applications found for email: ${email}. Using the most recent.`,
              );

              applications.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime() || 0;
                const dateB = new Date(b.created_at).getTime() || 0;
                return dateB - dateA;
              });
            }

            const application = applications[0];

            if (application.passed_exam && application.passed_exam_email_sent) {
              const {
                passedInterview,
                applicationStatus,
                passedInterviewDate,
              } = calculatePassedInterview(techScore, softScore, {
                weightTech: cycle.thresholdCycle.threshold.weight_tech,
                weightSoft: cycle.thresholdCycle.threshold.weight_soft,
                primaryPassingGrade:
                  cycle.thresholdCycle.threshold.primary_passing_grade,
                secondaryPassingGrade:
                  cycle.thresholdCycle.threshold.secondary_passing_grade,
              });

              await this.applicationsService.update(
                { id: application.id },
                {
                  tech_interview_score: techScore,
                  soft_interview_score: softScore,
                  passed_interview: passedInterview,
                  passed_interview_date: passedInterviewDate,
                  remarks,
                  status: applicationStatus,
                },
              );

              return {
                id: application.id,
                email,
                techInterviewScore: techScore,
                softInterviewScore: softScore,
                passedInterview: passedInterview ? 'Yes' : 'No',
                passedInterviewDate,
                remarks,
                applicationStatus,
              };
            }
            return {
              email,
              techScore,
              softScore,
            };
          },
        ),
      );

      let updatedData = updatedResults.filter((result) => result !== null);
      updatedData = convertToCamelCase(updatedData);

      return {
        message: 'Interview scores imported successfully.',
        updatedData,
      };
    } catch (error) {
      Logger.error('Error processing interview scores', error.stack);
      throw error;
    }
  };

  sendPassedExamEmails = async (data: SendingEmailsDto) => {
    const { cycleId, emails } = data;

    const applicationIds = emails.map((entry) => entry.ids);
    const uniqueEmails = emails.map((entry) => entry.emails);

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

    const applicationsByIds = await this.applicationsService.findMany(
      { id: In(applicationIds) },
      ['applicationUser'],
    );

    const emailsToSend = applicationsByIds.map((application) => {
      const email: string = application.applicationUser[0]?.user?.email;
      return {
        email,
        passedExam: application.passed_exam,
        applicationId: application.id,
      };
    });

    const passedExamEmails = emailsToSend.filter(
      (emailObj) =>
        uniqueEmails.includes(emailObj.email) && emailObj.passedExam,
    );

    const failedExamEmails = emailsToSend.filter(
      (emailObj) =>
        uniqueEmails.includes(emailObj.email) && !emailObj.passedExam,
    );

    const passedTemplateName = 'FSE/passedExam.hbs';
    const failedTemplateName = 'FSE/failedExam.hbs';
    const passedSubject = 'SE Factory | Welcome to Stage 3';
    const failedSubject = 'SE Factory | Full Stack Engineer';
    let passedMailerResponse;
    let failedMailerResponse;

    const templateVariables = {
      interviewMeetLink,
    };

    if (passedExamEmails.length > 0) {
      passedMailerResponse = await this.mailService.sendEmails(
        passedExamEmails.map((e) => e.email),
        passedTemplateName,
        passedSubject,
        templateVariables,
      );
    }

    if (failedExamEmails.length > 0) {
      failedMailerResponse = await this.mailService.sendEmails(
        failedExamEmails.map((e) => e.email),
        failedTemplateName,
        failedSubject,
        templateVariables,
      );
    }

    const affectedApplications = await Promise.all(
      applicationsByIds.map(async (application) => {
        const email = application.applicationUser[0]?.user?.email;
        const emailSent =
          passedMailerResponse?.foundEmails.some((e) => e.email === email) ||
          failedMailerResponse?.foundEmails.some((e) => e.email === email);

        await this.applicationsService.update(
          { id: application.id },
          { passed_exam_email_sent: emailSent },
        );

        return {
          id: application.id,
          email,
          passed_exam_email_sent: emailSent === true ? 'Yes' : 'No',
        };
      }),
    );

    const camelCaseApplications = convertToCamelCase(affectedApplications);

    return {
      message: 'Emails have been processed. Check the status for details.',
      passedExamEmails: {
        sent: passedMailerResponse?.foundEmails || [],
        notSent: passedMailerResponse?.notFoundEmails || [],
      },
      failedExamEmails: {
        sent: failedMailerResponse?.foundEmails || [],
        notSent: failedMailerResponse?.notFoundEmails || [],
      },
      applications: camelCaseApplications,
    };
  };

  sendStatusEmail = async (data: SendingEmailsDto) => {
    const { cycleId, emails } = data;

    const cyclesWhereConditions = cycleId ? { id: cycleId } : {};

    const currentCycle = await this.cyclesService.findOne(
      cyclesWhereConditions,
      ['decisionDateCycle'],
    );

    if (!currentCycle) {
      throwError('Cycle not found.', HttpStatus.BAD_REQUEST);
    }

    const requiredFields = [
      {
        field:
          currentCycle.decisionDateCycle.decisionDate.status_confirmation_form,
        message: 'Status Confirmation Form should be provided.',
      },
      {
        field: currentCycle.decisionDateCycle.decisionDate.orientation_date,
        message: 'Orientation Date should be provided.',
      },
      {
        field: currentCycle.decisionDateCycle.decisionDate.class_debut_date,
        message: 'Class Debut Date should be provided.',
      },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (field === null) {
        throwError(message, HttpStatus.BAD_REQUEST);
      }
    });

    const uniqueEmails: string[] = [
      ...new Set(emails.map((entry) => entry.emails)),
    ];

    const applicationWhereConditions = cycleId
      ? { applicationCycle: { cycleId } }
      : {};

    const applicationsByCycle = await this.applicationsService.findMany(
      applicationWhereConditions,
      ['applicationUser'],
    );

    const applicationsToEmail = applicationsByCycle.filter((application) => {
      const email: string = application.applicationUser[0]?.user?.email;
      return uniqueEmails.includes(email);
    });

    const emailsToSend = applicationsToEmail
      .map((application) => {
        const email: string = application.applicationUser[0]?.user?.email;
        let templateName: string;
        let subject: string;
        let templateVariables = {};

        switch (application.status) {
          case Status.ACCEPTED:
            templateName = 'FSE/passedInterview.hbs';
            subject = 'SE Factory Acceptance';
            templateVariables = {
              statusConfirmationForm:
                currentCycle.decisionDateCycle.decisionDate
                  .status_confirmation_form,
              orientationDate: formatReadableDate(
                currentCycle.decisionDateCycle.decisionDate.orientation_date,
              ),
              classDebutDate: formatReadableDate(
                currentCycle.decisionDateCycle.decisionDate.class_debut_date,
              ),
              submissionConfirmationDate: formatReadableDate(
                new Date(
                  new Date(
                    currentCycle.decisionDateCycle.decisionDate.orientation_date,
                  ).setDate(
                    new Date(
                      currentCycle.decisionDateCycle.decisionDate.orientation_date,
                    ).getDate() - 3,
                  ),
                ),
              ),
            };
            break;
          case Status.REJECTED:
            templateName = 'FSE/failedInterview.hbs';
            subject = 'SE Factory Application Status';
            break;
          case Status.WAITING_LIST:
            templateName = 'FSE/waitingList.hbs';
            subject = 'SE Factory Application Status';
            break;
          default:
            return null;
        }

        return {
          email,
          templateName,
          subject,
          templateVariables,
        };
      })
      .filter((item) => item !== null);

    let mailerResponse: any = { foundEmails: [], notFoundEmails: [] };

    if (emailsToSend.length > 0) {
      for (const emailData of emailsToSend) {
        const { email, templateName, subject, templateVariables } = emailData!;
        console.log(
          '🚀 ~ ApplicationMediator ~ sendStatusEmail= ~ templateVariables:',
          templateVariables,
        );

        const response = await this.mailService.sendEmails(
          [email],
          templateName,
          subject,
          templateVariables,
        );

        mailerResponse.foundEmails.push(email);
        mailerResponse.notFoundEmails.push(...response.notFoundEmails);
      }
    }

    const affectedApplications = await Promise.all(
      applicationsToEmail.map(async (application) => {
        const email = application.applicationUser[0]?.user?.email;
        const emailSent = mailerResponse.foundEmails.includes(email);

        await this.applicationsService.update(
          { id: application.id },
          { status_email_sent: emailSent },
        );

        return {
          id: application.id,
          email,
          status_email_sent: emailSent ? 'Yes' : 'No',
        };
      }),
    );

    const camelCaseApplications = convertToCamelCase(affectedApplications);

    return {
      message: 'Emails have been processed. Check the status for details.',
      foundEmails: mailerResponse.foundEmails,
      notFoundEmails: mailerResponse.notFoundEmails,
      applications: camelCaseApplications,
    };
  };
}
