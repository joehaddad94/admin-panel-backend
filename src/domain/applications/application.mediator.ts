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
import {
  EditApplicationDto,
  EditApplicationsDto,
  EditFCSApplicationsDto,
  RowEditApplicationsDto,
} from './dtos/edit.applications.dto';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { validateThresholdEntity } from 'src/core/helpers/validateThresholds';
import { Status } from 'src/core/data/types/applications/applications.types';
import { formatReadableDate } from 'src/core/helpers/formatDate';
import {
  calculatePassedExam,
  calculatePassedInterview,
  calculatePassedInterviewOptimized,
} from 'src/core/helpers/calculatePassingGrades';
import { In } from 'typeorm';
import { InterviewScoresDto } from './dtos/interview.scores.dto';
import { ApplicationCycle } from 'src/core/data/database/relations/application-cycle.entity';
import { Application } from 'src/core/data/database/entities/application.entity';
import { programConfigs } from './configs/screening.email.configs';
import { ApplicationSection } from 'src/core/data/database/relations/applications-sections.entity';
import { statusEmailConfigs } from './configs/status.email.configs';
import { interviewEmailConfigs } from './configs/interview.email.configs';
import { ApplyToFSEDto } from './dtos/apply.fse.dto';
import { ProgramService } from '../programs/program.service';
import { ApplicationUser } from 'src/core/data/database/relations/application-user.entity';
import { StatisticsMediator } from '../statistics/statistics.mediator';
import { ApplicationInfo } from 'src/core/data/database/relations/application-info.entity';
import { ApplicationProgram } from 'src/core/data/database/relations/application-program.entity';
import { InformationService } from '../information/information.service';
import { ImportDataDto } from './dtos/Import.data.dto';
import { SectionService } from '../sections/section.service';
import { applyFilters, applySorting, ApplicationData } from '../../core/helpers/filter-sort.helper';

@Injectable()
export class ApplicationMediator {
  private cycleCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute in milliseconds

  constructor(
    private readonly applicationsService: ApplicationService,
    private readonly cyclesService: CycleService,
    private readonly mailService: MailService,
    private readonly programsService: ProgramService,
    private readonly infoService: InformationService,
    private readonly sectionsService: SectionService,
    private readonly statisticsMediator: StatisticsMediator,
  ) {}

  private getCachedCycleData(cycleId: number): any | null {
    const cacheKey = `cycle_${cycleId}`;
    const cached = this.cycleCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }
    
    return null;
  }

  private setCachedCycleData(cycleId: number, data: any): void {
    const cacheKey = `cycle_${cycleId}`;
    this.cycleCache.set(cacheKey, { data, timestamp: Date.now() });
  }

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
        useAllCycles,
      } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;
      let latestCycle;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
        'applicationCycle',
        'applicationProgram',
        'applicationSection',
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
      } else if (!useAllCycles) {
        latestCycle = await this.applicationsService.getLatestCycle(programId);
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

      let mappedApplications: ApplicationData[] = applications.map((app) => {
        const applicationInfo = app.applicationInfo?.[0]?.info;
        const applicationUser = app.applicationUser?.[0]?.user;
        const applicationProgram = app.applicationProgram?.[0]?.program;
        
        return {
          id: app.id,
          sefId: applicationUser?.sef_id,
          username: applicationUser?.username,
          email: applicationUser?.email,
          firstName: applicationInfo?.first_name,
          lastName: applicationInfo?.last_name,
          fullName: applicationInfo ? `${applicationInfo.first_name || ''} ${applicationInfo.last_name || ''}`.trim() : '',
          dob: applicationInfo?.dob,
          countryOrigin: applicationInfo?.country_origin,
          countryResidence: applicationInfo?.country_residence,
          residencyStatus: applicationInfo?.residency_status,
          educationStatus: applicationInfo?.status,
          programName: applicationProgram?.program_name,
          program: applicationProgram?.abbreviation,
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
            applicationProgram?.abbreviation === 'FCS'
              ? app.is_eligible
              : app.is_eligible === true
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
          cycleId: app.applicationCycle?.[0]?.cycleId,
          cycleName: app.applicationCycle?.[0]?.cycle?.name,
          paid: app.paid,
          sectionName: app.applicationSection?.section?.name,
          userId: app.applicationUser?.[0]?.user_id,
          infoId: app.applicationInfo?.[0]?.info_id,
          fcsGraduate:
            app.fcs_graduate === true
              ? 'Yes'
              : app.fcs_graduate === false
              ? 'No'
              : '-',
        };
      });

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
        paid: app.paid === true ? 'Yes' : app.paid === false ? 'No' : '-',
        userId: app.applicationUser[0].user.id,
        infoId: app.applicationInfo[0].id,
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

  editApplication = async (data: EditApplicationDto) => {
    return catcher(async () => {
      const {
        id,
        isEligible,
        examScore,
        techInterviewScore,
        softInterviewScore,
        remarks,
        applicationStatus,
        cycleId,
        inputCycleId,
      } = data;

      const application = await this.applicationsService.findOne({ id });
      throwNotFound({ entity: 'application', errorCheck: !application });

      // Check if we're only updating isEligible or cycleId
      const isOnlyUpdatingEligibility =
        isEligible !== undefined &&
        examScore === undefined &&
        techInterviewScore === undefined &&
        softInterviewScore === undefined &&
        remarks === undefined &&
        applicationStatus === undefined &&
        inputCycleId === undefined;

      const isOnlyUpdatingCycle =
        cycleId !== undefined &&
        isEligible === undefined &&
        examScore === undefined &&
        techInterviewScore === undefined &&
        softInterviewScore === undefined &&
        remarks === undefined &&
        applicationStatus === undefined;

      if (isOnlyUpdatingEligibility) {
        // Only update eligibility status
        await this.applicationsService.update(
          { id },
          {
            is_eligible: isEligible,
            updated_at: new Date(),
          },
        );

        const updatedPayload = convertToCamelCase({
          id,
          is_eligible: isEligible,
          cycleId: application.applicationCycle[0]?.cycleId,
          inputCycleId: application.applicationCycle[0]?.cycleId,
        });

        return {
          message: 'Application eligibility updated successfully.',
          updatedPayload,
        };
      }

      if (isOnlyUpdatingCycle) {
        // Only update cycle
        await this.applicationsService.update(
          { id },
          {
            applicationCycle: [{ cycleId }],
            updated_at: new Date(),
          },
        );

        const updatedPayload = convertToCamelCase({
          id,
          cycleId,
          inputCycleId: cycleId,
        });

        return {
          message: 'Application cycle updated successfully.',
          updatedPayload,
        };
      }

      // Original logic for full updates
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
        is_eligible:
          isEligible !== undefined ? isEligible : application.is_eligible,
        exam_score:
          examScore !== undefined ? examScore : application.exam_score,
        tech_interview_score:
          techInterviewScore !== undefined
            ? techInterviewScore
            : application.tech_interview_score,
        soft_interview_score:
          softInterviewScore !== undefined
            ? softInterviewScore
            : application.soft_interview_score,
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

      if (inputCycleId && inputCycleId !== cycleId) {
        const applicationCycle = await ApplicationCycle.findOne({
          where: { applicationId: id, cycleId: cycleId },
        });

        if (applicationCycle) {
          applicationCycle.cycleId = inputCycleId;

          await ApplicationCycle.update(
            { id: applicationCycle.id },
            { cycleId: inputCycleId },
          );

          updatedData.cycleId = inputCycleId;
        }
      } else {
        updatedData.cycleId = cycleId;
      }

      const updatedPayload = convertToCamelCase({
        ...updatedData,
        eligible:
          updatedData.is_eligible === true
            ? 'Yes'
            : updatedData.is_eligible === false
            ? 'No'
            : '-',
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

  editApplications = async (data: EditApplicationsDto) => {
    return catcher(async () => {
      const { ids, cycleId, inputCycleId, isEligible } = data;
      const idsArray = Array.isArray(ids) ? ids : [ids];

      if (isEligible !== undefined) {
        const updateResult = await Application.update(
          { id: In(idsArray) },
          { is_eligible: isEligible },
        );
      }

      if (inputCycleId) {
        const updateResult = await ApplicationCycle.update(
          { applicationId: In(idsArray) },
          { cycleId: inputCycleId },
        );
      }

      const options: GlobalEntities[] = ['applicationCycle'];

      const applicationsEdited = await this.applicationsService.findMany(
        {
          id: In(idsArray),
        },
        options,
      );

      let updatedPayload = applicationsEdited.map((app) => {
        return {
          id: app.id,
          eligible:
            app.is_eligible === true
              ? 'Yes'
              : app.is_eligible === false
              ? 'No'
              : '-',
          cycleId: app.applicationCycle[0].cycleId,
        };
      });

      updatedPayload = convertToCamelCase(updatedPayload);

      return {
        message: 'Applications adjusted successfully.',
        updatedPayload,
      };
    });
  };

  editFCSApplications = async (data: EditFCSApplicationsDto) => {
    return catcher(async () => {
      const {
        ids,
        paid,
        isEligible,
        sectionId,
        inputCycleId,
        applicationStatus,
      } = data;
      const idsArray = Array.isArray(ids) ? ids : [ids];

      if (idsArray.length > 1) {
        const updateData: any = {};
        if (isEligible !== undefined) {
          updateData.is_eligible = isEligible;
        }
        if (paid !== undefined) {
          updateData.paid = paid;
        }
        if (applicationStatus !== undefined) {
          updateData.status = applicationStatus;
        }

        if (
          isEligible !== undefined ||
          paid !== undefined ||
          applicationStatus !== undefined
        ) {
          await Application.update({ id: In(idsArray) }, updateData);
        }

        if (sectionId !== undefined || inputCycleId !== undefined) {
          for (const appId of idsArray) {
            // Handle cycle update if needed
            if (inputCycleId !== undefined) {
              await ApplicationCycle.update(
                { applicationId: appId },
                { cycleId: inputCycleId },
              );
            }

            // Handle section update if needed
            if (sectionId !== undefined) {
              try {
                const existingSection = await ApplicationSection.findOne({
                  where: { application_new_id: appId },
                });

                if (existingSection) {
                  await ApplicationSection.update(
                    { id: existingSection.id },
                    { section_id: sectionId },
                  );
                } else {
                  const applicationStatus = Status.ACCEPTED;
                  const newSection = ApplicationSection.create({
                    application_new_id: appId,
                    section_id: sectionId,
                  });
                  await newSection.save();

                  await Application.update(
                    { id: appId },
                    { status: applicationStatus },
                  );
                }
              } catch (error) {
                if (error.code === '23505') {
                  // PostgreSQL unique violation error code
                  // If there's a unique constraint violation, try to update the existing record
                  const existingSection = await ApplicationSection.findOne({
                    where: { section_id: sectionId },
                  });
                  if (existingSection) {
                    await ApplicationSection.update(
                      { id: existingSection.id },
                      { application_new_id: appId },
                    );
                  }
                } else {
                  throw error;
                }
              }
            }
          }
        }

        const updatedApplications = await this.applicationsService.findMany(
          { id: In(idsArray) },
          ['applicationSection', 'applicationCycle'],
        );

        const updatedPayload = updatedApplications.map((app) => ({
          id: app.id,
          paid: app.paid,
          eligible: app.is_eligible,
          sectionName: app.applicationSection?.section?.name || null,
          cycleId: app.applicationCycle?.[0]?.cycleId || null,
          applicationStatus: app.status,
        }));

        return {
          message: 'Applications updated successfully',
          updatedPayload,
        };
      }

      const application = await this.applicationsService.findOne(
        { id: idsArray[0] },
        ['applicationSection'],
      );
      throwNotFound({ entity: 'application', errorCheck: !application });

      const updateData: any = {};
      if (isEligible !== undefined) {
        updateData.is_eligible = isEligible;
      }
      if (paid !== undefined) {
        updateData.paid = paid;
      }
      if (applicationStatus !== undefined) {
        updateData.status = applicationStatus;
      }

      await this.applicationsService.update({ id: idsArray[0] }, updateData);

      if (sectionId !== undefined) {
        try {
          const existingSection = await ApplicationSection.findOne({
            where: { application_new_id: idsArray[0] },
          });

          if (existingSection) {
            await ApplicationSection.update(
              { id: existingSection.id },
              { section_id: sectionId },
            );
          } else {
            const applicationStatus = Status.ACCEPTED;
            const newSection = ApplicationSection.create({
              application_new_id: idsArray[0],
              section_id: sectionId,
            });
            await newSection.save();

            await Application.update(
              { id: idsArray[0] },
              { status: applicationStatus },
            );
          }
        } catch (error) {
          if (error.code === '23505') {
            const existingSection = await ApplicationSection.findOne({
              where: { section_id: sectionId },
            });
            if (existingSection) {
              await ApplicationSection.update(
                { id: existingSection.id },
                { application_new_id: idsArray[0] },
              );
            }
          } else {
            throw error;
          }
        }
      }

      if (inputCycleId !== undefined) {
        await ApplicationCycle.update(
          { applicationId: idsArray[0] },
          { cycleId: inputCycleId },
        );
      }

      return {
        message: 'Application updated successfully',
        updatedPayload: {
          id: idsArray[0],
          paid: paid,
          eligible: isEligible,
          sectionId: sectionId,
          cycleId: inputCycleId,
          applicationStatus: applicationStatus,
        },
      };
    });
  };

  rowEditApplications = async (data: RowEditApplicationsDto) => {
    return catcher(async () => {
      const { ids, isEligible, examScore, techInterviewScore, softInterviewScore, paid, inputCycleId, applicationStatus, cycleId } = data;
      const idsArray = Array.isArray(ids) ? ids : [ids];

      const updateData: any = {};
      let passedExam: boolean | undefined;
      let passedExamDate: Date | undefined;
      let passedInterview: boolean | undefined;
      let passedInterviewDate: Date | undefined;
      let thresholdCycle: any = null;

      const needsCycleData = (examScore !== undefined && examScore !== null) || 
                           (techInterviewScore !== undefined && techInterviewScore !== null) ||
                           (softInterviewScore !== undefined && softInterviewScore !== null);
      
      const hasApplicationUpdates = 
        (isEligible !== undefined && isEligible !== null) ||
        (paid !== undefined && paid !== null) ||
        (examScore !== undefined && examScore !== null) ||
        (techInterviewScore !== undefined && techInterviewScore !== null) ||
        (softInterviewScore !== undefined && softInterviewScore !== null) ||
        (applicationStatus !== undefined && applicationStatus !== null);

      // Fetch cycle data once if needed
      if (needsCycleData) {
        if (!cycleId) {
          throwError('Cycle ID is required when updating scores', HttpStatus.BAD_REQUEST);
        }

        // Try to get cached cycle data first
        let cycle = this.getCachedCycleData(cycleId);
        
        if (!cycle) {
          // Cache miss - fetch from database
          const options: GlobalEntities[] = ['thresholdCycle'];
          cycle = await this.cyclesService.findOne({ id: cycleId }, options);

          if (!cycle) {
            throwError('Cycle is not found', HttpStatus.BAD_REQUEST);
          }

          // Cache the cycle data for 1 minute
          this.setCachedCycleData(cycleId, cycle);
        }

        thresholdCycle = cycle.thresholdCycle;
        if (!thresholdCycle || !thresholdCycle.threshold) {
          throwError(
            'Please provide thresholds for this cycle',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          validateThresholdEntity(thresholdCycle.threshold);
        }
      }

      if (isEligible !== undefined && isEligible !== null) {
        updateData.is_eligible = isEligible;
      }
      if (paid !== undefined && paid !== null) {
        updateData.paid = paid;
      }
      if (applicationStatus !== undefined && applicationStatus !== null) {
        updateData.status = applicationStatus;
      }

      if (examScore !== undefined && examScore !== null) {
        const result = calculatePassedExam(
          examScore,
          thresholdCycle.threshold.exam_passing_grade,
        );
        passedExam = result.passedExam;
        passedExamDate = result.passedExamDate;
        updateData.exam_score = examScore;
        updateData.passed_exam = passedExam;
        updateData.passed_exam_date = new Date();
      }

      // Handle interview scores - can handle single scores by fetching missing score from DB
      if ((techInterviewScore !== undefined && techInterviewScore !== null) || 
          (softInterviewScore !== undefined && softInterviewScore !== null)) {
        
        // Update individual scores first
        if (techInterviewScore !== undefined && techInterviewScore !== null) {
          updateData.tech_interview_score = techInterviewScore;
        }
        if (softInterviewScore !== undefined && softInterviewScore !== null) {
          updateData.soft_interview_score = softInterviewScore;
        }

        // Process each application individually for interview scores
        for (const applicationId of idsArray) {
          console.log(`=== Processing application ${applicationId} ===`);
          
          const individualUpdateData = { ...updateData };
          console.log('Initial individualUpdateData:', JSON.stringify(individualUpdateData, null, 2));

          // Update individual scores first
          if (techInterviewScore !== undefined && techInterviewScore !== null) {
            individualUpdateData.tech_interview_score = techInterviewScore;
          }
          if (softInterviewScore !== undefined && softInterviewScore !== null) {
            individualUpdateData.soft_interview_score = softInterviewScore;
          }

          // Calculate passed interview using optimized function that fetches missing score from DB
          const result = await calculatePassedInterviewOptimized(
            applicationId,
            techInterviewScore,
            softInterviewScore,
            {
              weightTech: thresholdCycle.threshold.weight_tech,
              weightSoft: thresholdCycle.threshold.weight_soft,
              primaryPassingGrade: thresholdCycle.threshold.primary_passing_grade,
              secondaryPassingGrade: thresholdCycle.threshold.secondary_passing_grade,
            }
          );

          passedInterview = result.passedInterview;
          passedInterviewDate = result.passedInterviewDate;
          individualUpdateData.passed_interview = passedInterview;
          individualUpdateData.passed_interview_date = new Date();
          
          // Only calculate status based on interview if applicationStatus is not provided
          if (applicationStatus === undefined || applicationStatus === null) {
            individualUpdateData.status = passedInterview ? Status.ACCEPTED : Status.REJECTED;
          } else {
            // Use the provided applicationStatus
            individualUpdateData.status = applicationStatus;
          }
          
          // Update this specific application
          const updateResult = await Application.update({ id: applicationId }, individualUpdateData);
        }
      } else if (hasApplicationUpdates) {
        // If no interview scores to process, update all applications with the same data
        await Application.update({ id: In(idsArray) }, updateData);
      }

      if (inputCycleId !== undefined) {
        await ApplicationCycle.update(
          { applicationId: In(idsArray) },
          { cycleId: inputCycleId },
        );
      }

      // Generate response payload based on whether interview scores were processed
      let updatedPayload;

      if ((techInterviewScore !== undefined && techInterviewScore !== null) ||
          (softInterviewScore !== undefined && softInterviewScore !== null)) {
        // For interview scores, each application might have different results
        // We need to fetch the updated applications to get the actual results
        const updatedApplications = await Application.find({ where: { id: In(idsArray) } });
        
        const applicationsMap = new Map(updatedApplications.map(app => [app.id, app]));

        updatedPayload = idsArray.map((id) => {
          const application = applicationsMap.get(id);
          const payload = {
            id,
            paid: paid !== undefined && paid !== null ? paid : undefined,
            eligible: isEligible !== undefined && isEligible !== null ? isEligible : undefined,
            examScore: examScore !== undefined && examScore !== null ? examScore : undefined,
            passedExam: passedExam !== undefined && passedExam !== null ? passedExam === true ? 'Yes' : 'No' : undefined,
            passedExamDate: passedExamDate !== undefined && passedExamDate !== null ? passedExamDate : undefined,
            techInterviewScore: techInterviewScore !== undefined && techInterviewScore !== null ? techInterviewScore : undefined,
            softInterviewScore: softInterviewScore !== undefined && softInterviewScore !== null ? softInterviewScore : undefined,
            passedInterview: application?.passed_interview !== undefined && application?.passed_interview !== null ? application.passed_interview === true ? 'Yes' : 'No' : undefined,
            passedInterviewDate: application?.passed_interview_date !== undefined && application?.passed_interview_date !== null ? application.passed_interview_date : undefined,
            cycleId: inputCycleId,
            applicationStatus: applicationStatus !== undefined && applicationStatus !== null ? applicationStatus :
                             (application?.status !== undefined && application?.status !== null) ? application.status : undefined,
          };
          return payload;
        });
      } else {
        // For non-interview updates, all applications get the same values
        updatedPayload = idsArray.map((id) => ({
          id,
          paid: paid !== undefined && paid !== null ? paid : undefined,
          eligible: isEligible !== undefined && isEligible !== null ? isEligible : undefined,
          examScore: examScore !== undefined && examScore !== null ? examScore : undefined,
          passedExam: passedExam !== undefined && passedExam !== null ? passedExam === true ? 'Yes' : 'No' : undefined,
          passedExamDate: passedExamDate !== undefined && passedExamDate !== null ? passedExamDate : undefined,
          techInterviewScore: techInterviewScore !== undefined && techInterviewScore !== null ? techInterviewScore : undefined,
          softInterviewScore: softInterviewScore !== undefined && softInterviewScore !== null ? softInterviewScore : undefined,
          passedInterview: passedInterview !== undefined && passedInterview !== null ? passedInterview === true ? 'Yes' : 'No' : undefined,
          passedInterviewDate: passedInterviewDate !== undefined && passedInterviewDate !== null ? passedInterviewDate : undefined,
          cycleId: inputCycleId,
          applicationStatus: applicationStatus !== undefined && applicationStatus !== null ? applicationStatus : undefined,
        }));
      }

      return {
        message: idsArray.length > 1 ? 'Applications updated successfully' : 'Application updated successfully',
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
        ['decisionDateCycle', 'cycleProgram'],
      );

      if (!currentCycle?.cycleProgram?.program?.abbreviation) {
        throwError('Program not found for this cycle', HttpStatus.BAD_REQUEST);
      }

      const programAbbr = currentCycle.cycleProgram.program.abbreviation;
      const programConfig = programConfigs[programAbbr];

      if (!programConfig) {
        throwError(
          `No configuration found for program: ${programAbbr}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!currentCycle.decisionDateCycle?.decisionDate) {
        throwError(
          'Decision date not found for this cycle',
          HttpStatus.BAD_REQUEST,
        );
      }

      const decisionDate = currentCycle.decisionDateCycle.decisionDate;

      // Validate required fields
      programConfig.requiredFields.forEach(({ field, message }) => {
        if (!decisionDate[field]) {
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
      const applicationsToUpdate = [];

      // Process applications and collect updates
      for (const application of applicationsByCycle) {
        const email: string = application.applicationUser[0]?.user?.email;
        if (uniqueEmails.includes(email)) {
          if (application.is_eligible) {
            if (!application.passed_screening) {
              application.passed_screening = true;
              application.passed_screening_date = new Date();
              applicationsToUpdate.push({
                id: application.id,
                passed_screening: true,
                passed_screening_date: new Date(),
              });
              eligibleApplicationsToEmail.push({
                ...application,
                passed_screening: 'Yes',
                status: application.applicationInfo[0].info.status,
              });
            } else if (!application.screening_email_sent) {
              eligibleApplicationsToEmail.push({
                ...application,
                passed_screening: 'Yes',
                status: application.applicationInfo[0].info.status,
              });
            }
          } else {
            application.passed_screening = false;
            application.passed_screening_date = new Date();
            applicationsToUpdate.push({
              id: application.id,
              passed_screening: false,
              passed_screening_date: new Date(),
            });
            ineligibleApplicationsToEmail.push({
              ...application,
              passed_screening: 'No',
              status: application.applicationInfo[0].info.status,
            });
          }
        }
      }

      // Batch update applications
      if (applicationsToUpdate.length > 0) {
        const batchUpdates = applicationsToUpdate.map((update) => ({
          id: update.id,
          data: {
            passed_screening: update.passed_screening,
            passed_screening_date: update.passed_screening_date,
          },
        }));
        await this.applicationsService.batchUpdate(batchUpdates);
      }

      const eligibleEmailsToSend = eligibleApplicationsToEmail.map(
        (app) => app.applicationUser[0]?.user?.email,
      );

      const ineligibleEmailsToSend = ineligibleApplicationsToEmail.map(
        (app) => app.applicationUser[0]?.user?.email,
      );

      let mailerResponseEligible: any;
      let mailerResponseIneligible: any;

      // Send emails in parallel if both types exist
      const emailPromises = [];

      if (eligibleEmailsToSend.length > 0) {
        const templateVariables =
          programConfig.getTemplateVariables(decisionDate);

        emailPromises.push(
          this.mailService.sendEmails(
            eligibleEmailsToSend,
            programConfig.templates.eligible.name,
            programConfig.templates.eligible.subject,
            templateVariables,
          ).then((response) => ({ type: 'eligible', response }))
        );
      }

      if (ineligibleEmailsToSend.length > 0) {
        emailPromises.push(
          this.mailService.sendEmails(
            ineligibleEmailsToSend,
            programConfig.templates.ineligible.name,
            programConfig.templates.ineligible.subject,
          ).then((response) => ({ type: 'ineligible', response }))
        );
      }

      // Wait for all emails to be sent
      const emailResults = await Promise.all(emailPromises);

      // Process results
      emailResults.forEach(({ type, response }) => {
        if (type === 'eligible') {
          mailerResponseEligible = response;
        } else {
          mailerResponseIneligible = response;
        }
      });

      const resultsEligible = mailerResponseEligible?.results || [];
      const resultsIneligible = mailerResponseIneligible?.results || [];

      const sentEmailSetEligible = new Set(
        resultsEligible.filter((res) => !res.error).map((res) => res.email),
      );
      const sentEmailSetIneligible = new Set(
        resultsIneligible.filter((res) => !res.error).map((res) => res.email),
      );

      // Batch update email sent status
      const emailStatusUpdates = [];

      for (const application of eligibleApplicationsToEmail) {
        const email = application.applicationUser[0]?.user?.email;
        const emailSent = sentEmailSetEligible.has(email);
        emailStatusUpdates.push({
          id: application.id,
          screening_email_sent: emailSent,
        });
        application.screening_email_sent = emailSent ? 'Yes' : 'No';
      }

      for (const application of ineligibleApplicationsToEmail) {
        const email = application.applicationUser[0]?.user?.email;
        const emailSent = sentEmailSetIneligible.has(email);
        emailStatusUpdates.push({
          id: application.id,
          screening_email_sent: emailSent,
        });
        application.screening_email_sent = emailSent ? 'Yes' : 'No';
      }

      // Batch update email sent status
      if (emailStatusUpdates.length > 0) {
        const batchEmailUpdates = emailStatusUpdates.map((update) => ({
          id: update.id,
          data: { screening_email_sent: update.screening_email_sent },
        }));
        await this.applicationsService.batchUpdate(batchEmailUpdates);
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
    const { cycleId, emails, attachmentUrl, submissionUrl, interviewDateTime } = data;

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
      currentCycle.decisionDateCycle?.decisionDate?.link_1;

    const cycleProgram = await this.programsService.findOne(
      { cycleProgram: { cycle_id: currentCycle.id } },
      ['cycleProgram'],
    );

    if (!cycleProgram) {
      throwError('Program not found for this cycle', HttpStatus.BAD_REQUEST);
    }

    const programConfig = interviewEmailConfigs[cycleProgram.abbreviation];

    if (!programConfig) {
      throwError(
        `No interview email configuration found for program: ${cycleProgram.abbreviation}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const requiredField of programConfig.requiredFields) {
      const fieldValue = currentCycle.decisionDateCycle?.decisionDate?.[requiredField.field];
      if (!fieldValue) {
        throwError(requiredField.message, HttpStatus.BAD_REQUEST);
      }
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

    let passedMailerResponse;
    let failedMailerResponse;

    // Create separate template variables for passed and failed emails
    const passedTemplateVariables = {
      ...programConfig.getTemplateVariables(interviewMeetLink, attachmentUrl, submissionUrl, interviewDateTime),
    };

    const failedTemplateVariables = {
      ...programConfig.getTemplateVariables(interviewMeetLink),
    };

    if (passedExamEmails.length > 0) {
      passedMailerResponse = await this.mailService.sendEmails(
        passedExamEmails.map((e) => e.email),
        programConfig.templates.passed.name,
        programConfig.templates.passed.subject,
        passedTemplateVariables,
      );
    }

    if (failedExamEmails.length > 0) {
      failedMailerResponse = await this.mailService.sendEmails(
        failedExamEmails.map((e) => e.email),
        programConfig.templates.failed.name,
        programConfig.templates.failed.subject,
        failedTemplateVariables,
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

  sendScheduleConfirmationEmails = async (data: SendingEmailsDto) => {
    return catcher(async () => {
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

      const requiredFields = [
        {
          field: currentCycle.decisionDateCycle.decisionDate.date_2,
          message: 'Bootcamp Start Date should be provided.',
        },
        {
          field: currentCycle.decisionDateCycle.decisionDate.link_2,
          message: 'Class Division Form should be provided.',
        },
      ];

      requiredFields.forEach(({ field, message }) => {
        if (field === null) {
          throwError(message, HttpStatus.BAD_REQUEST);
        }
      });

      const applicationsByIds = await this.applicationsService.findMany(
        { id: In(applicationIds) },
        ['applicationUser', 'applicationInfo'],
      );

      const applicationsToEmail = applicationsByIds.filter((application) => {
        const email: string = application.applicationUser[0]?.user?.email;
        return uniqueEmails.includes(email);
      });

      const templateName = 'FCS/schedule-confirmation.hbs';
      const subject = 'SE Factory | Schedule Confirmation';

      const templateVariables = {
        bootcampStartDate: formatReadableDate(
          currentCycle.decisionDateCycle.decisionDate.date_2,
        ),
        classDivisionForm: currentCycle.decisionDateCycle.decisionDate.link_2,
      };

      let mailerResponse: any = { foundEmails: [], notFoundEmails: [] };

      if (applicationsToEmail.length > 0) {
        const response = await this.mailService.sendEmails(
          applicationsToEmail.map((app) => app.applicationUser[0]?.user?.email),
          templateName,
          subject,
          templateVariables,
        );

        mailerResponse = response;
      }

      const sentEmailSet = new Set(
        mailerResponse.foundEmails.map((item) => item.email),
      );

      for (const app of applicationsToEmail) {
        const email = app.applicationUser[0]?.user?.email;
        if (sentEmailSet.has(email)) {
          await this.applicationsService.update(
            { id: app.id },
            { passed_exam_email_sent: true },
          );
          (app as any).passed_exam_email_sent = 'Yes';
          (app as any).passed_screening =
            app.passed_screening === true ? 'Yes' : 'No';
          (app as any).screening_email_sent =
            app.screening_email_sent === true ? 'Yes' : 'No';
        } else {
          await this.applicationsService.update(
            { id: app.id },
            { passed_exam_email_sent: false },
          );
          (app as any).passed_exam_email_sent = 'No';
          (app as any).passed_screening =
            app.passed_screening === true ? 'Yes' : 'No';
          (app as any).screening_email_sent =
            app.screening_email_sent === true ? 'Yes' : 'No';
        }
      }

      const camelCaseApplications = convertToCamelCase(applicationsToEmail);

      return {
        message:
          'Schedule confirmation emails have been processed. Check the status for details.',
        foundEmails: mailerResponse.foundEmails,
        notFoundEmails: mailerResponse.notFoundEmails,
        applications: camelCaseApplications,
      };
    });
  };

  sendStatusEmail = async (data: SendingEmailsDto) => {
    const { cycleId, emails, orientationInfo, submissionDateTime } = data;

    const cyclesWhereConditions = cycleId ? { id: cycleId } : {};

    const currentCycle = await this.cyclesService.findOne(
      cyclesWhereConditions,
      ['decisionDateCycle', 'cycleProgram'],
    );

    if (!currentCycle?.cycleProgram?.program?.abbreviation) {
      throwError('Program not found for this cycle', HttpStatus.BAD_REQUEST);
    }

    const programAbbr = currentCycle.cycleProgram.program.abbreviation;
    const programConfig = statusEmailConfigs[programAbbr];

    if (!programConfig) {
      throwError(
        `No configuration found for program: ${programAbbr}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!currentCycle.decisionDateCycle?.decisionDate) {
      throwError(
        'Decision date not found for this cycle',
        HttpStatus.BAD_REQUEST,
      );
    }

    const decisionDate = currentCycle.decisionDateCycle.decisionDate;

    // Validate required fields
    programConfig.requiredFields.forEach(({ field, message }) => {
      if (!decisionDate[field]) {
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
      ['applicationUser', 'applicationSection'],
    );

    const applicationsToEmail = applicationsByCycle.filter((application) => {
      const email: string = application.applicationUser[0]?.user?.email;
      return uniqueEmails.includes(email);
    });

    const emailsToSend = applicationsToEmail
      .map((application) => {
        const email: string = application.applicationUser[0]?.user?.email;
        const templateConfig = programConfig.templates[application.status];
        const sectionName = application.applicationSection?.section?.name || '';

        if (!templateConfig) {
          return null;
        }

        return {
          email,
          templateName: templateConfig.name,
          subject: templateConfig.getSubject
            ? templateConfig.getSubject(sectionName)
            : templateConfig.subject,
          templateVariables: programConfig.getTemplateVariables(
            decisionDate,
            application.applicationSection?.section,
            orientationInfo,
            submissionDateTime,
          ),
        };
      })
      .filter((item) => item !== null);

    let mailerResponse: any = { foundEmails: [], notFoundEmails: [] };

    if (emailsToSend.length > 0) {
      for (const emailData of emailsToSend) {
        const { email, templateName, subject, templateVariables } = emailData!;

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

  applyToFSE = async (data: ApplyToFSEDto) => {
    return catcher(async () => {
      const { selectedApplicationsIds, targetedFSECycleId } = data;

      let programId: number;
      const program = await this.programsService.findOne({
        abbreviation: 'FSE',
      });

      if (!program) {
        throwError('Program not found', HttpStatus.BAD_REQUEST);
      }

      programId = program.id;

      const newFSEApplications = await Promise.all(
        selectedApplicationsIds.map(async (applicationIds) => {
          // First verify the info exists
          const info = await this.infoService.findOne({
            id: applicationIds.infoId,
          });

          if (!info) {
            throwError(
              `Info with ID ${applicationIds.infoId} not found`,
              HttpStatus.BAD_REQUEST,
            );
          }

          // Create and save the application
          const application = (await this.applicationsService.save({
            is_eligible: true,
            passed_screening: true,
            passed_screening_date: new Date(),
            passed_exam: true,
            passed_exam_date: new Date(),
            screening_email_sent: true,
            fcs_graduate: true,
            created_at: new Date(),
            updated_at: new Date(),
          })) as Application;

          // Create and save relationships
          await ApplicationUser.create({
            application_new_id: application.id,
            user_id: applicationIds.userId,
          }).save();

          await ApplicationInfo.create({
            application_new_id: application.id,
            info_id: applicationIds.infoId,
          }).save();

          await ApplicationProgram.create({
            applicationId: application.id,
            programId: programId,
          }).save();

          await ApplicationCycle.create({
            applicationId: application.id,
            cycleId: targetedFSECycleId,
          }).save();

          return application;
        }),
      );

      return {
        message: 'Applications created successfully',
        applications: newFSEApplications,
      };
    });
  };

  importData = async (data: ImportDataDto) => {
    return catcher(async () => {
      const { cycleId, importType, data: importData } = data;

      const applications = await this.applicationsService.findMany(
        {
          applicationCycle: { cycleId },
        },
        ['applicationCycle', 'applicationSection', 'applicationInfo'],
      );

      function normalizePhone(phone: string): string {
        return phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
      }

      switch (importType) {
        case 'paid':
          const updatedApplications = [];
          const unmatchedEntries = [];

          for (const entry of importData) {
            const phoneNumber = String(entry.phone);
            const paidStatus = entry.paid;
            const normalizedPhone = normalizePhone(phoneNumber);

            const application = applications.find((app) => {
              const dbPhone = normalizePhone(
                app.applicationInfo?.[0]?.info?.mobile || '',
              );
              return dbPhone === normalizedPhone;
            });

            if (application) {
              const isPaid = Boolean(paidStatus);

              await this.applicationsService.update(
                { id: application.id },
                { paid: isPaid },
              );
              updatedApplications.push({
                id: application.id,
                phoneNumber,
                paid: isPaid,
                firstName: application.applicationInfo[0]?.info?.first_name,
                lastName: application.applicationInfo[0]?.info?.last_name,
              });
            } else {
              unmatchedEntries.push({
                phoneNumber,
                paid: Boolean(paidStatus),
                reason: 'No matching application found with this phone number',
              });
            }
          }

          const response: any = {
            message: 'Payment status import completed',
            summary: {
              totalProcessed: Array.isArray(importData)
                ? importData.length
                : Object.keys(importData).length,
              successfulUpdates: updatedApplications.length,
              failedUpdates: unmatchedEntries.length,
            },
            updatedData: updatedApplications,
            failedUpdates: unmatchedEntries,
          };

          if (unmatchedEntries.length > 0) {
            const headers = [
              'Phone Number',
              'Paid Status',
              'Reason',
              'Import Date',
            ];
            const rows = unmatchedEntries.map((entry) => [
              entry.phoneNumber,
              entry.paid ? 'Yes' : 'No',
              entry.reason,
              new Date().toISOString(),
            ]);
            response.failedAttemptsCSV = [
              headers.join(','),
              ...rows.map((row) => row.join(',')),
            ].join('\n');
          }

          return response;

        case 'sections':
          const updatedSections = [];
          const unmatchedSectionEntries = [];

          // Fetch all sections from the DB (assuming you have a Section entity/service)
          const allSections = await this.sectionsService.findMany({}); // Adjust as needed

          for (const entry of importData) {
            const email = String(entry.email).trim().toLowerCase();
            const sectionName = String(entry.section).trim().toLowerCase();

            // Find application by email
            const application = applications.find(
              (app) =>
                (app.applicationInfo?.[0]?.info?.email || '')
                  .trim()
                  .toLowerCase() === email,
            );

            // Find section by name
            const section = allSections.find(
              (sec) => (sec.name || '').trim().toLowerCase() === sectionName,
            );

            if (application && section) {
              // Update applicationSection table
              await ApplicationSection.update(
                { application_new_id: application.id },
                { section_id: section.id },
              );
              updatedSections.push({
                applicationId: application.id,
                email,
                sectionName: section.name,
              });
            } else {
              unmatchedSectionEntries.push({
                email,
                sectionName,
                reason: !application
                  ? 'No matching application found with this email'
                  : 'No matching section found with this section name',
              });
            }
          }

          const sectionResponse: any = {
            message: 'Section import completed',
            summary: {
              totalProcessed: Array.isArray(importData)
                ? importData.length
                : Object.keys(importData).length,
              successfulUpdates: updatedSections.length,
              failedUpdates: unmatchedSectionEntries.length,
            },
            updatedData: updatedSections,
            failedUpdates: unmatchedSectionEntries,
          };

          if (unmatchedSectionEntries.length > 0) {
            const headers = ['Email', 'Section Name', 'Reason', 'Import Date'];
            const rows = unmatchedSectionEntries.map((entry) => [
              entry.email,
              entry.sectionName,
              entry.reason,
              new Date().toISOString(),
            ]);
            sectionResponse.failedAttemptsCSV = [
              headers.join(','),
              ...rows.map((row) => row.join(',')),
            ].join('\n');
          }

          return sectionResponse;

        case 'applicationStatus':
          const updatedStatuses = [];
          const unmatchedStatusEntries = [];

          for (const entry of importData) {
            const email = String(entry.email).trim().toLowerCase();
            const status = String(entry.status).trim().toUpperCase();

            // Find application by email
            const application = applications.find(
              (app) =>
                (app.applicationInfo?.[0]?.info?.email || '')
                  .trim()
                  .toLowerCase() === email,
            );

            if (application) {
              // Update application status
              await this.applicationsService.update(
                { id: application.id },
                { status },
              );
              updatedStatuses.push({
                id: application.id,
                email,
                status,
                firstName: application.applicationInfo[0]?.info?.first_name,
                lastName: application.applicationInfo[0]?.info?.last_name,
              });
            } else {
              unmatchedStatusEntries.push({
                email,
                status,
                reason: 'No matching application found with this email',
              });
            }
          }

          const statusResponse: any = {
            message: 'Application status import completed',
            summary: {
              totalProcessed: Array.isArray(importData)
                ? importData.length
                : Object.keys(importData).length,
              successfulUpdates: updatedStatuses.length,
              failedUpdates: unmatchedStatusEntries.length,
            },
            updatedData: updatedStatuses,
            failedUpdates: unmatchedStatusEntries,
          };

          if (unmatchedStatusEntries.length > 0) {
            const headers = ['Email', 'Status', 'Reason', 'Import Date'];
            const rows = unmatchedStatusEntries.map((entry) => [
              entry.email,
              entry.status,
              entry.reason,
              new Date().toISOString(),
            ]);
            statusResponse.failedAttemptsCSV = [
              headers.join(','),
              ...rows.map((row) => row.join(',')),
            ].join('\n');
          }

          return statusResponse;
      }
    });
  };

  findApplicationsNew = async (
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
        useAllCycles,
        search,
        filters,
        sort,
      } = filtersDto;

      const currentPage = dtoPage ?? page;
      const currentPageSize = dtoPageSize ?? pageSize;
      let latestCycle;

      const options: GlobalEntities[] = [
        'applicationInfo',
        'applicationProgram',
        'applicationUser',
        'applicationCycle',
        'applicationProgram',
        'applicationSection',
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
      } else if (!useAllCycles) {
        latestCycle = await this.applicationsService.getLatestCycle(programId);
        if (latestCycle) {
          if (!whereConditions.applicationCycle) {
            whereConditions.applicationCycle = {};
          }
          whereConditions.applicationCycle.cycleId = latestCycle.id;
        }
      }

      const needsFullData = (sort && sort.length > 0) || (filters && filters.length > 0) || (search && search.trim() !== '');
      
      let applications, total;
      
      if (needsFullData) {
        [applications, total] = await this.applicationsService.findAndCount(
          whereConditions,
          options,
        );
      } else {
        [applications, total] = await this.applicationsService.findAndCount(
          whereConditions,
          options,
          undefined,
          (currentPage - 1) * currentPageSize,
          currentPageSize,
        );
      }

      throwNotFound({
        entity: 'applications',
        errorCheck: !applications,
      });

      let mappedApplications: ApplicationData[] = applications.map((app) => {
        const applicationInfo = app.applicationInfo?.[0]?.info;
        const applicationUser = app.applicationUser?.[0]?.user;
        const applicationProgram = app.applicationProgram?.[0]?.program;
        
        return {
          id: app.id,
          sefId: applicationUser?.sef_id,
          username: applicationUser?.username,
          email: applicationUser?.email,
          firstName: applicationInfo?.first_name,
          lastName: applicationInfo?.last_name,
          fullName: applicationInfo ? `${applicationInfo.first_name || ''} ${applicationInfo.last_name || ''}`.trim() : '',
          dob: applicationInfo?.dob,
          countryOrigin: applicationInfo?.country_origin,
          countryResidence: applicationInfo?.country_residence,
          residencyStatus: applicationInfo?.residency_status,
          educationStatus: applicationInfo?.status,
          programName: applicationProgram?.program_name,
          program: applicationProgram?.abbreviation,
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
            applicationProgram?.abbreviation === 'FCS'
              ? app.is_eligible
              : app.is_eligible === true
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
          cycleId: app.applicationCycle?.[0]?.cycleId,
          cycleName: app.applicationCycle?.[0]?.cycle?.name,
          paid: app.paid,
          sectionName: app.applicationSection?.section?.name,
          userId: app.applicationUser?.[0]?.user_id,
          infoId: app.applicationInfo?.[0]?.info_id,
          fcsGraduate:
            app.fcs_graduate === true
              ? 'Yes'
              : app.fcs_graduate === false
              ? 'No'
              : '-',
        };
      });

      if (search && search.trim()) {
        const searchTerm = search.toLowerCase().trim();
        mappedApplications = mappedApplications.filter((app) => {
          return (
            app.fullName?.toLowerCase().includes(searchTerm) ||
            app.email?.toLowerCase().includes(searchTerm) ||
            app.username?.toLowerCase().includes(searchTerm) ||
            app.sefId?.toLowerCase().includes(searchTerm) ||
            app.applicationStatus?.toLowerCase().includes(searchTerm)
          );
        });
      }

      if (filters && filters.length > 0) {
        mappedApplications = applyFilters(mappedApplications, filters);
      }

      if (sort && sort.length > 0) {
        mappedApplications = applySorting(mappedApplications, sort);
      } else {
        // Default sorting by application date if no sort criteria provided
        mappedApplications.sort(
          (a, b) =>
            new Date(a.applicationDate).getTime() -
            new Date(b.applicationDate).getTime(),
        );
      }

      // Apply pagination only when we fetched all data
      let finalApplications, finalTotal;
      
      if (needsFullData) {
        // Apply pagination after sorting and filtering
        const startIndex = (currentPage - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;
        finalApplications = mappedApplications.slice(startIndex, endIndex);
        finalTotal = mappedApplications.length;
      } else {
        // No pagination needed - we already have the correct page
        finalApplications = mappedApplications;
        finalTotal = total;
      }

      return {
        applications: finalApplications,
        total: finalTotal,
        page: currentPage,
        pageSize: currentPageSize,
        latestCycle,
      };
    });
  };
}
