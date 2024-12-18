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

  createEditDates = async (data: CreateEditDecisionDateDto) => {
    return catcher(async () => {
      const {
        examDate,
        cycleId,
        decisionDateId,
        interviewMeetLink,
        examLink,
        // examRegistrationForm,
        infoSessionRecordedLink,
      } = data;

      let decisionDate: DecisionDates;
      let successMessage: string;

      const updateField = (field: string, value: any) => {
        return value !== undefined && value.trim() !== '' ? value : field;
      };

      if (decisionDateId) {
        decisionDate = await this.decisionDateService.findOne({
          id: decisionDateId,
        });
        if (!decisionDate) {
          throw new Error(`Decision date with ID ${decisionDateId} not found`);
        }

        decisionDate.exam_date = examDate
          ? new Date(examDate)
          : decisionDate.exam_date;
        decisionDate.interview_meet_link = updateField(
          decisionDate.interview_meet_link,
          interviewMeetLink,
        );
        decisionDate.exam_link = updateField(decisionDate.exam_link, examLink);
        // decisionDate.exam_registration_form = updateField(
        //   decisionDate.exam_registration_form,
        //   examRegistrationForm,
        // );
        decisionDate.info_session_recorded_link = updateField(
          decisionDate.info_session_recorded_link,
          infoSessionRecordedLink,
        );

        decisionDate.updated_at = new Date();

        decisionDate = (await this.decisionDateService.save(
          decisionDate,
        )) as DecisionDates;
        successMessage = 'Decision Date updated succesfully.';
      } else {
        decisionDate = this.decisionDateService.create({
          exam_date: examDate || null,
          interview_meet_link:
            interviewMeetLink && interviewMeetLink.trim() !== ''
              ? interviewMeetLink
              : null,
          exam_link: examLink && examLink.trim() !== '' ? examLink : null,
          // exam_registration_form:
          //   examRegistrationForm && examRegistrationForm.trim() !== ''
          //     ? examRegistrationForm
          //     : null,
          info_session_recorded_link:
            infoSessionRecordedLink && infoSessionRecordedLink.trim() !== ''
              ? infoSessionRecordedLink
              : null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        decisionDate = (await this.decisionDateService.save(
          decisionDate,
        )) as DecisionDates;

        const decisionDateCycle = new DecisionDateCycle();
        decisionDateCycle.cycle_id = cycleId;
        decisionDateCycle.decision_date_id = decisionDate.id;

        await decisionDateCycle.save();

        decisionDate.decisionDateCycle = decisionDateCycle;
        successMessage = 'Decision Date created succesfully.';
      }

      const camelCaseCreatedDates = convertToCamelCase(decisionDate);
      return { message: successMessage, decisionDate: camelCaseCreatedDates };
    });
  };
}
