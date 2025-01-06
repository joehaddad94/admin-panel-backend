/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { DecisionDateService } from './decision-date.service';
import { catcher } from '../../core/helpers/operation';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';
import { DecisionDateCycle } from '../../core/data/database/relations/decisionDate-cycle.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { CreateEditDecisionDateDto } from './dtos/create-dates.dto';

@Injectable()
export class DecisionDateMediator {
  constructor(private readonly decisionDateService: DecisionDateService) {}

  // createEditDates = async (data: CreateEditDecisionDateDto) => {
  //   return catcher(async () => {
  //     const {
  //       examDate,
  //       cycleId,
  //       decisionDateId,
  //       interviewMeetLink,
  //       examLink,
  //       statusConfirmationForm,
  //       infoSessionRecordedLink,
  //       orientationDate,
  //       classDebutDate,
  //     } = data;

  //     let decisionDate: DecisionDates;
  //     let successMessage: string;

  //     const updateField = (field: string, value: any) => {
  //       return value !== undefined && value !== null && value.trim() !== ''
  //         ? value
  //         : field;
  //     };

  //     if (decisionDateId) {
  //       decisionDate = await this.decisionDateService.findOne({
  //         id: decisionDateId,
  //       });
  //       if (!decisionDate) {
  //         throw new Error(`Decision date with ID ${decisionDateId} not found`);
  //       }

  //       decisionDate.exam_date = examDate
  //         ? new Date(examDate)
  //         : decisionDate.exam_date;
  //       decisionDate.interview_meet_link = updateField(
  //         decisionDate.interview_meet_link,
  //         interviewMeetLink,
  //       );
  //       decisionDate.exam_link = updateField(decisionDate.exam_link, examLink);
  //       decisionDate.status_confirmation_form = updateField(
  //         decisionDate.status_confirmation_form,
  //         statusConfirmationForm,
  //       );
  //       decisionDate.info_session_recorded_link = updateField(
  //         decisionDate.info_session_recorded_link,
  //         infoSessionRecordedLink,
  //       );
  //       decisionDate.orientation_date = orientationDate
  //         ? new Date(orientationDate)
  //         : decisionDate.orientation_date;

  //       decisionDate.class_debut_date = classDebutDate
  //         ? new Date(classDebutDate)
  //         : decisionDate.class_debut_date;

  //       decisionDate.updated_at = new Date();

  //       decisionDate = (await this.decisionDateService.save(
  //         decisionDate,
  //       )) as DecisionDates;
  //       successMessage = 'Decision Date updated succesfully.';
  //     } else {
  //       decisionDate = this.decisionDateService.create({
  //         exam_date: examDate || null,
  //         interview_meet_link:
  //           interviewMeetLink && interviewMeetLink.trim() !== ''
  //             ? interviewMeetLink
  //             : null,
  //         exam_link: examLink && examLink.trim() !== '' ? examLink : null,
  //         status_confirmation_form:
  //           statusConfirmationForm && statusConfirmationForm.trim() !== ''
  //             ? statusConfirmationForm
  //             : null,
  //         info_session_recorded_link:
  //           infoSessionRecordedLink && infoSessionRecordedLink.trim() !== ''
  //             ? infoSessionRecordedLink
  //             : null,
  //         orientation_date: orientationDate || null,
  //         class_debut_date: classDebutDate || null,
  //         created_at: new Date(),
  //         updated_at: new Date(),
  //       });

  //       decisionDate = (await this.decisionDateService.save(
  //         decisionDate,
  //       )) as DecisionDates;

  //       const decisionDateCycle = new DecisionDateCycle();
  //       decisionDateCycle.cycle_id = cycleId;
  //       decisionDateCycle.decision_date_id = decisionDate.id;

  //       await decisionDateCycle.save();

  //       decisionDate.decisionDateCycle = decisionDateCycle;
  //       successMessage = 'Decision Date created succesfully.';
  //     }

  //     const camelCaseCreatedDates = convertToCamelCase(decisionDate);
  //     return { message: successMessage, decisionDate: camelCaseCreatedDates };
  //   });
  // };

  createEditDates = async (data: CreateEditDecisionDateDto) => {
    return catcher(async () => {
      const {
        examDate,
        cycleId,
        decisionDateId,
        interviewMeetLink,
        examLink,
        statusConfirmationForm,
        infoSessionRecordedLink,
        orientationDate,
        classDebutDate,
      } = data;

      let decisionDate: DecisionDates;
      let successMessage: string;

      const sanitizeField = (value: any) =>
        typeof value === 'string' && value.trim() !== '' ? value : null;

      if (decisionDateId) {
        decisionDate = await this.decisionDateService.findOne({
          id: decisionDateId,
        });

        if (!decisionDate) {
          throw new Error(`Decision date with ID ${decisionDateId} not found`);
        }

        Object.assign(decisionDate, {
          exam_date: examDate ? new Date(examDate) : decisionDate.exam_date,
          interview_meet_link:
            sanitizeField(interviewMeetLink) ??
            decisionDate.interview_meet_link,
          exam_link: sanitizeField(examLink) ?? decisionDate.exam_link,
          status_confirmation_form:
            sanitizeField(statusConfirmationForm) ??
            decisionDate.status_confirmation_form,
          info_session_recorded_link:
            sanitizeField(infoSessionRecordedLink) ??
            decisionDate.info_session_recorded_link,
          orientation_date: orientationDate
            ? new Date(orientationDate)
            : decisionDate.orientation_date,
          class_debut_date: classDebutDate
            ? new Date(classDebutDate)
            : decisionDate.class_debut_date,
          updated_at: new Date(),
        });

        await this.decisionDateService.save(decisionDate);
        successMessage = 'Decision Date updated successfully.';
      } else {
        decisionDate = this.decisionDateService.create({
          exam_date: examDate || null,
          interview_meet_link: sanitizeField(interviewMeetLink),
          exam_link: sanitizeField(examLink),
          status_confirmation_form: sanitizeField(statusConfirmationForm),
          info_session_recorded_link: sanitizeField(infoSessionRecordedLink),
          orientation_date: orientationDate || null,
          class_debut_date: classDebutDate || null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        await this.decisionDateService.save(decisionDate);

        const decisionDateCycle = new DecisionDateCycle();
        decisionDateCycle.cycle_id = cycleId;
        decisionDateCycle.decision_date_id = decisionDate.id;

        await decisionDateCycle.save();

        decisionDate.decisionDateCycle = decisionDateCycle;
        successMessage = 'Decision Date created successfully.';
      }

      return {
        message: successMessage,
        decisionDate: convertToCamelCase(decisionDate),
      };
    });
  };
}
