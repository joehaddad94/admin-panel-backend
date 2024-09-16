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
      const { examDate, cycleId, decisionDateId, interviewMeetLink } = data;

      let decisionDate: DecisionDates;
      let successMessage: string;

      if (decisionDateId) {
        decisionDate = await this.decisionDateService.findOne({
          id: decisionDateId,
        });
        if (!decisionDate) {
          throw new Error(`Decision date with ID ${decisionDateId} not found`);
        }

        if (examDate !== undefined) {
          if (!examDate) {
            decisionDate.exam_date = null;
          } else {
            decisionDate.exam_date = new Date(examDate);
          }
        }

        if (interviewMeetLink !== undefined) {
          if (interviewMeetLink.trim() === '') {
            decisionDate.interview_meet_link = null;
          } else {
            decisionDate.interview_meet_link = interviewMeetLink;
          }
        }

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
