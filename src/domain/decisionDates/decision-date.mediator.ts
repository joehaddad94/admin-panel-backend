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
      console.log('🚀 ~ DecisionDateMediator ~ createEditDates ~ Input data:', data);

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

      const sanitizeField = (value: any) => {
        const result = typeof value === 'string' && value.trim() !== '' ? value : null;
        console.log('🔍 ~ DecisionDateMediator ~ sanitizeField ~ Input:', value, 'Output:', result);
        return result;
      };

      if (decisionDateId) {
        console.log('📝 ~ DecisionDateMediator ~ Updating existing decision date with ID:', decisionDateId);
        
        decisionDate = await this.decisionDateService.findOne({
          id: decisionDateId,
        });

        if (!decisionDate) {
          console.error('❌ ~ DecisionDateMediator ~ Decision date not found with ID:', decisionDateId);
          throw new Error(`Decision date with ID ${decisionDateId} not found`);
        }

        console.log('📊 ~ DecisionDateMediator ~ Current decision date state:', decisionDate);

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

        console.log('🔄 ~ DecisionDateMediator ~ Update data:', updateData);

        Object.assign(decisionDate, updateData);

        console.log('💾 ~ DecisionDateMediator ~ Saving updated decision date...');
        await this.decisionDateService.save(decisionDate);
        console.log('✅ ~ DecisionDateMediator ~ Decision date updated successfully');
        
        successMessage = 'Decision Date updated successfully.';
      } else {
        console.log('📝 ~ DecisionDateMediator ~ Creating new decision date');
        
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

        console.log('🆕 ~ DecisionDateMediator ~ Create data:', createData);

        decisionDate = this.decisionDateService.create(createData);

        console.log('💾 ~ DecisionDateMediator ~ Saving new decision date...');
        await this.decisionDateService.save(decisionDate);
        console.log('✅ ~ DecisionDateMediator ~ New decision date saved successfully');

        console.log('🔗 ~ DecisionDateMediator ~ Creating decision date cycle relationship...');
        const decisionDateCycle = new DecisionDateCycle();
        decisionDateCycle.cycle_id = cycleId;
        decisionDateCycle.decision_date_id = decisionDate.id;

        await decisionDateCycle.save();
        console.log('✅ ~ DecisionDateMediator ~ Decision date cycle relationship created');

        decisionDate.decisionDateCycle = decisionDateCycle;
        successMessage = 'Decision Date created successfully.';
      }

      const result = {
        message: successMessage,
        decisionDate: convertToCamelCase(decisionDate),
      };

      console.log('🎉 ~ DecisionDateMediator ~ Final result:', result);
      return result;
    });
  };
}
