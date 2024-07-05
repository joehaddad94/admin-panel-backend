/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { DecisionDateService } from './decision-date.service';
import { catcher } from '../../core/helpers/operation';
import { Admin } from 'typeorm';
import { CreateDecisionDateDto } from './dtos/create-dates.dto';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';
import { DecisionDateCycle } from '../../core/data/database/relations/decisionDate-cycle.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';

@Injectable()
export class DecisionDateMediator {
  constructor(private readonly decisionDateService: DecisionDateService) {}

  createDates = async (admin: Admin, data: CreateDecisionDateDto) => {
    return catcher(async () => {
      const { examDate, cycleId } = data;

      const decisionDate = this.decisionDateService.create({
        exam_date: examDate,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const createdDates = (await this.decisionDateService.save(
        decisionDate,
      )) as DecisionDates;

      if (!createdDates || !createdDates.id) {
        throw new Error('Failed to create dates or retrieve dates ID');
      }

      const decisionDateCycle = new DecisionDateCycle();
      decisionDateCycle.cycle_id = cycleId;

      await decisionDateCycle.save();

      createdDates.decisionDateCycle = decisionDateCycle;

      const camelCaseCreatedDates = convertToCamelCase(createdDates);
      return camelCaseCreatedDates;
    });
  };
}
