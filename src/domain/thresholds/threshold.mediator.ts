import { Injectable } from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { CreateEditThresholdsDto } from './dtos/create-edit.dto';
import { catcher } from 'src/core/helpers/operation';
import { Threshold } from 'src/core/data/database/entities/threshold.entity';
import { ThresholdCycle } from 'src/core/data/database/relations/cycle-threshold.entity';
import { convertToCamelCase } from 'src/core/helpers/camelCase';

@Injectable()
export class ThresholdMediator {
  constructor(private readonly thresholdService: ThresholdService) {}

  createEditThresholds = async (data: CreateEditThresholdsDto) => {
    return catcher(async () => {
      const {
        cycleId,
        examPassingGrade,
        primaryPassingGrade,
        secondaryPassingGrade,
        thresholdId,
        weightSoft,
        weightTech,
      } = data;
      console.log(
        '🚀 ~ ThresholdMediator ~ returncatcher ~ data:',
        thresholdId,
      );

      let threshold: Threshold;

      if (thresholdId) {
        threshold = await this.thresholdService.findOne({
          id: thresholdId,
        });
        console.log(
          '🚀 ~ ThresholdMediator ~ returncatcher ~ threshold:',
          threshold,
        );

        if (!threshold) {
          throw new Error(`Threshold with ID ${thresholdId} not found`);
        }

        const updates = {
          exam_passing_grade: examPassingGrade,
          weight_soft: weightSoft,
          weight_tech: weightTech,
          primary_passing_grade: primaryPassingGrade,
          secondary_passing_grade: secondaryPassingGrade,
          updated_at: new Date(),
        };

        for (const key in updates) {
          if (updates[key] !== undefined) {
            threshold[key] = updates[key];
          }
        }

        console.log(
          '🚀 ~ ThresholdMediator ~ returncatcher ~ updates:',
          updates,
        );

        threshold = (await this.thresholdService.save(threshold)) as Threshold;
        console.log(
          '🚀 ~ ThresholdMediator ~ returncatcher ~ updatedthreshold:',
          threshold,
        );
      } else {
        threshold = this.thresholdService.create({
          exam_passing_grade: examPassingGrade || 0,
          weight_soft: weightSoft || 0,
          weight_tech: weightTech || 0,
          primary_passing_grade: primaryPassingGrade || 0,
          secondary_passing_grade: secondaryPassingGrade || 0,
          created_at: new Date(),
          updated_at: new Date(),
        });

        threshold = (await this.thresholdService.save(threshold)) as Threshold;

        const thresholdCycle = new ThresholdCycle();
        thresholdCycle.cycle_id = cycleId;
        thresholdCycle.threshold_id = threshold.id;

        await thresholdCycle.save();

        threshold.thresholdCycle = thresholdCycle;
      }

      const camelCaseThresholds = convertToCamelCase(threshold);
      return camelCaseThresholds;
    });
  };
}
