import { Injectable } from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { CreateEditThresholdsDto } from './dtos/create-edit.dto';
import { catcher } from '../../core/helpers/operation';
import { Threshold } from '../../core/data/database/entities/threshold.entity';
import { ThresholdCycle } from '../../core/data/database/relations/cycle-threshold.entity';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { ApplicationService } from '../applications/application.service';

@Injectable()
export class ThresholdMediator {
  constructor(
    private readonly thresholdService: ThresholdService,
    private readonly applicationService: ApplicationService,
  ) {}

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

      let threshold: Threshold;
      let successMessage: string;

      if (thresholdId) {
        threshold = await this.thresholdService.findOne({
          id: thresholdId,
        });

        if (!threshold) {
          throw new Error(`Threshold with ID ${thresholdId} not found`);
        }

        const updates: Partial<Threshold> = {};
        if (examPassingGrade !== null)
          updates.exam_passing_grade = examPassingGrade;
        if (weightSoft !== null) updates.weight_soft = weightSoft;
        if (weightTech !== null) updates.weight_tech = weightTech;
        if (primaryPassingGrade !== null)
          updates.primary_passing_grade = primaryPassingGrade;
        if (secondaryPassingGrade !== null)
          updates.secondary_passing_grade = secondaryPassingGrade;
        updates.updated_at = new Date();

        Object.assign(threshold, updates);

        threshold = (await this.thresholdService.save(threshold)) as Threshold;

        //   const applicationsWhereConditions = cycleId
        //   ? {
        //       applicationCycle: { cycleId },
        //     }
        //   : {};

        // const applicationsByCycle = await this.applicationService.findMany(
        //   applicationsWhereConditions,
        //   ['applicationInfo'],
        // );

        successMessage = 'Threshold updated successfully';
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
        successMessage = 'Threshold created successfully';
      }

      const camelCaseThresholds = convertToCamelCase(threshold);
      return { message: successMessage, threshold: camelCaseThresholds };
    });
  };
}
