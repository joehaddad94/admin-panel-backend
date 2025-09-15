import { Threshold } from '../../../../core/data/database/entities/threshold.entity';
import { CreateEditThresholdsDto } from '../../dtos/create-edit.dto';

export class ThresholdFactory {
  static createMockThreshold(
    overrides: Partial<Threshold> = {},
  ): Partial<Threshold> {
    const defaultThreshold: Partial<Threshold> = {
      id: 1,
      exam_passing_grade: 70,
      weight_tech: 0.7,
      weight_soft: 0.3,
      primary_passing_grade: 15,
      secondary_passing_grade: 12,
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      published_at: null,
      created_by_id: 1,
      updated_by_id: 1,
      thresholdCycle: {
        id: 1,
        cycle_id: 1,
        threshold_id: 1,
        cycle: null,
        threshold: null,
      } as any,
    };
    return { ...defaultThreshold, ...overrides };
  }

  static createMockCreateEditThresholdsDto(
    overrides: Partial<CreateEditThresholdsDto> = {},
  ): CreateEditThresholdsDto {
    const defaultDto: CreateEditThresholdsDto = {
      cycleId: 1,
      examPassingGrade: 70,
      weightTech: 0.7,
      weightSoft: 0.3,
      primaryPassingGrade: 15,
      secondaryPassingGrade: 12,
    };
    return { ...defaultDto, ...overrides };
  }

  static createMockCreateThresholdDto(): CreateEditThresholdsDto {
    return {
      cycleId: 1,
      examPassingGrade: 70,
      weightTech: 0.7,
      weightSoft: 0.3,
      primaryPassingGrade: 15,
      secondaryPassingGrade: 12,
    };
  }

  static createMockUpdateThresholdDto(): CreateEditThresholdsDto {
    return {
      thresholdId: 1,
      cycleId: 1,
      examPassingGrade: 75,
      weightTech: 0.6,
      weightSoft: 0.4,
      primaryPassingGrade: 16,
      secondaryPassingGrade: 13,
    };
  }

  static createMockPartialUpdateThresholdDto(): CreateEditThresholdsDto {
    return {
      thresholdId: 1,
      cycleId: 1,
      examPassingGrade: 80,
      // Only updating examPassingGrade, other fields remain null
    };
  }

  static createMockThresholdWithDefaults(): Partial<Threshold> {
    return {
      id: 1,
      exam_passing_grade: 0,
      weight_tech: 0,
      weight_soft: 0,
      primary_passing_grade: 0,
      secondary_passing_grade: 0,
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      published_at: null,
      created_by_id: 1,
      updated_by_id: 1,
    };
  }

  static createMockThresholdsList(count: number = 2): Partial<Threshold>[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockThreshold({
        id: index + 1,
        exam_passing_grade: 70 + index * 5,
        weight_tech: 0.7 - index * 0.1,
        weight_soft: 0.3 + index * 0.1,
      }),
    );
  }

  static createMockThresholdCycle(overrides: any = {}) {
    return {
      id: 1,
      cycle_id: 1,
      threshold_id: 1,
      ...overrides,
    };
  }

  static createMockThresholdResponse(
    threshold: Partial<Threshold> = this.createMockThreshold(),
  ) {
    return {
      message: 'Threshold created successfully',
      threshold: {
        id: threshold.id,
        examPassingGrade: threshold.exam_passing_grade,
        weightTech: threshold.weight_tech,
        weightSoft: threshold.weight_soft,
        primaryPassingGrade: threshold.primary_passing_grade,
        secondaryPassingGrade: threshold.secondary_passing_grade,
        createdAt: threshold.created_at,
        updatedAt: threshold.updated_at,
        publishedAt: threshold.published_at,
        createdById: threshold.created_by_id,
        updatedById: threshold.updated_by_id,
      },
    };
  }

  static createMockUpdateResponse(
    threshold: Partial<Threshold> = this.createMockThreshold(),
  ) {
    return {
      message: 'Threshold updated successfully',
      threshold: {
        id: threshold.id,
        examPassingGrade: threshold.exam_passing_grade,
        weightTech: threshold.weight_tech,
        weightSoft: threshold.weight_soft,
        primaryPassingGrade: threshold.primary_passing_grade,
        secondaryPassingGrade: threshold.secondary_passing_grade,
        createdAt: threshold.created_at,
        updatedAt: threshold.updated_at,
        publishedAt: threshold.published_at,
        createdById: threshold.created_by_id,
        updatedById: threshold.updated_by_id,
      },
    };
  }
}
