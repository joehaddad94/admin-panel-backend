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
import { EditApplicationsDto } from './dtos/edit.applications.dto';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { validateThresholdEntity } from 'src/core/helpers/validateThresholds';
import { Status } from 'src/core/data/types/applications/applications.types';
import { format } from 'date-fns';

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
        techInterviewScore: app.tech_interview_score,
        softInterviewScore: app.soft_interview_score,
        passedInterviewDate: new Date(app.passed_interview_date),
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
        techInterviewScore: app.tech_interview_score,
        softInterviewScore: app.soft_interview_score,
        passedInterviewDate: new Date(app.passed_interview_date),
        passedInterview:
          app.passed_interview === true
            ? 'Yes'
            : app.passed_exam === false
            ? 'No'
            : '-',
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
        status,
        cycleId,
      } = data;

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

      const application = await this.applicationsService.findOne({ id });
      throwNotFound({ entity: 'application', errorCheck: !application });

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
        status: status,
        updated_at: new Date(),
      };

      const { threshold } = thresholdCycle;
      if (threshold.exam_passing_grade && updatedData.exam_score >= 0) {
        updatedData.passed_exam =
          updatedData.exam_score >= threshold.exam_passing_grade;
        updatedData.passed_exam_date = new Date();
      }

      const finalTechInterviewScore = updatedData.tech_interview_score;
      const finalSoftInterviewScore = updatedData.soft_interview_score;

      if (
        threshold.weight_tech &&
        threshold.weight_soft &&
        finalTechInterviewScore >= 0 &&
        finalSoftInterviewScore >= 0
      ) {
        const interviewGrade =
          threshold.weight_tech * finalTechInterviewScore +
          threshold.weight_soft * finalSoftInterviewScore;

        if (interviewGrade >= threshold.primary_passing_grade) {
          updatedData.passed_interview = true;
          updatedData.status = Status.ACCEPTED;
        } else if (interviewGrade >= threshold.secondary_passing_grade) {
          updatedData.passed_interview = true;
          updatedData.status = Status.WAITING_LIST;
        } else {
          updatedData.passed_interview = false;
          updatedData.status = Status.REJECTED;
        }
        updatedData.passed_interview_date = new Date();
      }

      const response = await this.applicationsService.update(
        { id },
        updatedData,
      );

      const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

      const updatedPayload = convertToCamelCase({
        ...updatedData,
        applicationStatus: updatedData.status,
        passedExamDate: updatedData.passed_exam_date
          ? formatDate(updatedData.passed_exam_date)
          : null,
        passedInterviewDate: updatedData.passed_interview_date
          ? formatDate(updatedData.passed_interview_date)
          : null,
      });

      delete updatedPayload.status;

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
            currentCycle.decisionDateCycle.decisionDate.exam_registration_form,
          message: 'Exam Registration Form should be provided.',
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
          application.passed_screening_date = new Date();
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

      const formattedApplications = applicationsToEmail.map((application) => ({
        ...application,
        passed_screening: application.passed_screening ? 'Yes' : 'No',
      }));

      const emailsToSend = formattedApplications.map(
        (app) => app.applicationUser[0].user.email,
      );

      let mailerResponse: any;
      const templateVariables = {
        examDate: currentCycle.decisionDateCycle.decisionDate.exam_date,
        examLink: currentCycle.decisionDateCycle.decisionDate.exam_link,
        examRgistrationForm:
          currentCycle.decisionDateCycle.decisionDate.exam_registration_form,
        infoSessionRecordedLink:
          currentCycle.decisionDateCycle.decisionDate
            .info_session_recorded_link,
      };
      if (emailsToSend.length > 0) {
        const subject = 'SE Factory Screening Process';
        const templateName = 'FSW/shortlisted.hbs';
        mailerResponse = this.mailService.sendEmails(
          emailsToSend,
          templateName,
          subject,
          templateVariables,
        );
      }

      const camelCaseApplications = convertToCamelCase(formattedApplications);

      return {
        message: 'Emails sent successfully.',
        foundEmails: mailerResponse?.foundEmails || [],
        notFoundEmails: mailerResponse?.notFoundEmails || [],
        applications: camelCaseApplications,
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
            return {
              id: application.id,
              examScore: score,
              passed_exam,
              passed_exam_date,
            };
          }
          return null;
        }),
      );

      let updatedData = updateResults.filter((result) => result !== null);
      updatedData = convertToCamelCase(updatedData);

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

    const uniqueEmails: string[] = [...new Set(emails)];

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
        const email: string = application.applicationUser[0].user.email;
        let templateName: string;
        let subject: string;

        switch (application.status) {
          case Status.ACCEPTED:
            templateName = 'acceptance-mail.hbs';
            subject = 'SE Factory Acceptance';
            break;
          case Status.REJECTED:
            templateName = 'rejection-mail.hbs';
            subject = 'SE Factory Application Status';
            break;
          case Status.WAITING_LIST:
            templateName = 'waiting-list-mail.hbs';
            subject = 'SE Factory Application Status';
            break;
          default:
            return null;
        }

        return {
          email,
          templateName,
          subject,
        };
      })
      .filter((item) => item !== null);
    let mailerResponse: any = { foundEmails: [], notFoundEmails: [] };

    if (emailsToSend.length > 0) {
      for (const emailData of emailsToSend) {
        const { email, templateName, subject } = emailData;
        const templateVariables = {};

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

    return {
      message: 'Status emails sent successfully.',
      foundEmails: mailerResponse.foundEmails,
      notFoundEmails: mailerResponse.notFoundEmails,
    };
  };
}
