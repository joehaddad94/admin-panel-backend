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
        dateTime1,
        cycleId,
        decisionDateId,
        link1,
        link4,
        link3,
        link2,
        date1,
        date2,
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

        const updateData = {
          date_time_1: dateTime1 ? new Date(dateTime1) : decisionDate.date_time_1,
          link_1: sanitizeField(link1) ?? decisionDate.link_1,
          link_4: sanitizeField(link4) ?? decisionDate.link_4,
          link_3: sanitizeField(link3) ?? decisionDate.link_3,
          link_2: sanitizeField(link2) ?? decisionDate.link_2,
          date_1: date1 ? new Date(date1) : decisionDate.date_1,
          date_2: date2 ? new Date(date2) : decisionDate.date_2,
          updated_at: new Date(),
        };

        Object.assign(decisionDate, updateData);
        await this.decisionDateService.save(decisionDate);
        successMessage = 'Decision Date updated successfully.';
      } else {
        const createData = {
          date_time_1: dateTime1 || null,
          link_1: sanitizeField(link1),
          link_4: sanitizeField(link4),
          link_3: sanitizeField(link3),
          link_2: sanitizeField(link2),
          date_1: date1 || null,
          date_2: date2 || null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        decisionDate = this.decisionDateService.create(createData);
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
