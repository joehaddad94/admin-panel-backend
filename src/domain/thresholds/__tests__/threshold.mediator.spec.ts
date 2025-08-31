import { Test, TestingModule } from '@nestjs/testing';
import { ThresholdMediator } from '../threshold.mediator';
import { ThresholdService } from '../threshold.service';
import { ApplicationService } from '../../applications/application.service';
import { CreateEditThresholdsDto } from '../dtos/create-edit.dto';
import { Threshold } from '../../../core/data/database/entities/threshold.entity';
import { ThresholdCycle } from '../../../core/data/database/relations/cycle-threshold.entity';

// Mock ThresholdCycle
jest.mock('../../../core/data/database/relations/cycle-threshold.entity', () => {
  const mockThresholdCycle = jest.fn().mockImplementation(() => ({
    cycle_id: 1,
    threshold_id: 1,
    save: jest.fn().mockResolvedValue({ id: 1, cycle_id: 1, threshold_id: 1 }),
  }));

  return {
    ThresholdCycle: Object.assign(mockThresholdCycle, {
      save: jest.fn().mockResolvedValue({ id: 1, cycle_id: 1, threshold_id: 1 }),
    }),
  };
});

describe('ThresholdMediator', () => {
  let mediator: ThresholdMediator;
  let thresholdService: ThresholdService;
  let applicationService: ApplicationService;
  let module: TestingModule;

  const mockThresholdService = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockApplicationService = {
    findMany: jest.fn(),
  };

  const mockThreshold: Partial<Threshold> = {
    id: 1,
    exam_passing_grade: 70,
    weight_soft: 0.3,
    weight_tech: 0.7,
    primary_passing_grade: 15,
    secondary_passing_grade: 12,
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
    thresholdCycle: {
      id: 1,
      cycle_id: 1,
      threshold_id: 1,
    } as any,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThresholdMediator,
        {
          provide: ThresholdService,
          useValue: mockThresholdService,
        },
        {
          provide: ApplicationService,
          useValue: mockApplicationService,
        },
      ],
    }).compile();

    mediator = module.get<ThresholdMediator>(ThresholdMediator);
    thresholdService = module.get<ThresholdService>(ThresholdService);
    applicationService = module.get<ApplicationService>(ApplicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of ThresholdMediator', () => {
      expect(mediator).toBeInstanceOf(ThresholdMediator);
    });

    it('should have service dependency injected', () => {
      expect(thresholdService).toBeDefined();
      expect(applicationService).toBeDefined();
    });

    it('should have all mediator methods', () => {
      expect(mediator.createEditThresholds).toBeDefined();
    });
  });

  describe('createEditThresholds', () => {
    it('should create a new threshold', async () => {
      const createDto: CreateEditThresholdsDto = {
        cycleId: 1,
        examPassingGrade: 70,
        weightSoft: 0.3,
        weightTech: 0.7,
        primaryPassingGrade: 15,
        secondaryPassingGrade: 12,
      };

      const newThreshold = {
        ...mockThreshold,
        id: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockThresholdService.create.mockReturnValue(newThreshold);
      mockThresholdService.save.mockResolvedValue({
        ...newThreshold,
        id: 1,
      });

      const result = await mediator.createEditThresholds(createDto);

      expect(thresholdService.create).toHaveBeenCalledWith({
        exam_passing_grade: 70,
        weight_soft: 0.3,
        weight_tech: 0.7,
        primary_passing_grade: 15,
        secondary_passing_grade: 12,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(thresholdService.save).toHaveBeenCalledWith(newThreshold);
      expect(result).toEqual({
        message: 'Threshold created successfully',
        threshold: expect.objectContaining({
          id: 1,
          examPassingGrade: 70,
          weightSoft: 0.3,
          weightTech: 0.7,
          primaryPassingGrade: 15,
          secondaryPassingGrade: 12,
        }),
      });
    });

    it('should update an existing threshold', async () => {
      const updateDto: CreateEditThresholdsDto = {
        thresholdId: 1,
        cycleId: 1,
        examPassingGrade: 75,
        weightSoft: 0.4,
        weightTech: 0.6,
        primaryPassingGrade: 16,
        secondaryPassingGrade: 13,
      };

      const existingThreshold = { ...mockThreshold };
      const updatedThreshold = {
        ...existingThreshold,
        exam_passing_grade: 75,
        weight_soft: 0.4,
        weight_tech: 0.6,
        primary_passing_grade: 16,
        secondary_passing_grade: 13,
        updated_at: new Date(),
      };

      mockThresholdService.findOne.mockResolvedValue(existingThreshold);
      mockThresholdService.save.mockResolvedValue(updatedThreshold);

      const result = await mediator.createEditThresholds(updateDto);

      expect(thresholdService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(thresholdService.save).toHaveBeenCalledWith(updatedThreshold);
      expect(result).toEqual({
        message: 'Threshold updated successfully',
        threshold: expect.objectContaining({
          id: 1,
          examPassingGrade: 75,
          weightSoft: 0.4,
          weightTech: 0.6,
          primaryPassingGrade: 16,
          secondaryPassingGrade: 13,
        }),
      });
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: CreateEditThresholdsDto = {
        thresholdId: 1,
        cycleId: 1,
        examPassingGrade: 80,
        // Only updating examPassingGrade, other fields remain null
      };

      const existingThreshold = { ...mockThreshold };
      const updatedThreshold = {
        ...existingThreshold,
        exam_passing_grade: 80,
        weight_soft: undefined,
        weight_tech: undefined,
        primary_passing_grade: undefined,
        secondary_passing_grade: undefined,
        updated_at: new Date(),
      };

      mockThresholdService.findOne.mockResolvedValue(existingThreshold);
      mockThresholdService.save.mockResolvedValue(updatedThreshold);

      const result = await mediator.createEditThresholds(partialUpdateDto);

      expect(thresholdService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(thresholdService.save).toHaveBeenCalledWith(updatedThreshold);
      expect(result).toEqual({
        message: 'Threshold updated successfully',
        threshold: expect.objectContaining({
          id: 1,
          examPassingGrade: 80,
        }),
      });
    });

    it('should throw error when threshold not found for update', async () => {
      const updateDto: CreateEditThresholdsDto = {
        thresholdId: 999,
        cycleId: 1,
        examPassingGrade: 75,
      };

      mockThresholdService.findOne.mockResolvedValue(null);

      await expect(mediator.createEditThresholds(updateDto)).rejects.toThrow(
        'Threshold with ID 999 not found',
      );

      expect(thresholdService.findOne).toHaveBeenCalledWith({ id: 999 });
      expect(thresholdService.save).not.toHaveBeenCalled();
    });

    it('should handle null values in updates', async () => {
      const updateDto: CreateEditThresholdsDto = {
        thresholdId: 1,
        cycleId: 1,
        examPassingGrade: null,
        weightSoft: null,
        weightTech: null,
        primaryPassingGrade: null,
        secondaryPassingGrade: null,
      };

      const existingThreshold = { ...mockThreshold };
      const updatedThreshold = {
        ...existingThreshold,
        updated_at: new Date(),
      };

      mockThresholdService.findOne.mockResolvedValue(existingThreshold);
      mockThresholdService.save.mockResolvedValue(updatedThreshold);

      const result = await mediator.createEditThresholds(updateDto);

      expect(thresholdService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(thresholdService.save).toHaveBeenCalledWith(updatedThreshold);
      expect(result).toEqual({
        message: 'Threshold updated successfully',
        threshold: expect.objectContaining({
          id: 1,
        }),
      });
    });

    it('should handle default values for new threshold creation', async () => {
      const createDto: CreateEditThresholdsDto = {
        cycleId: 1,
        // All values are null/undefined, should use defaults
      };

      const newThreshold = {
        ...mockThreshold,
        id: undefined,
        exam_passing_grade: 0,
        weight_soft: 0,
        weight_tech: 0,
        primary_passing_grade: 0,
        secondary_passing_grade: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockThresholdService.create.mockReturnValue(newThreshold);
      mockThresholdService.save.mockResolvedValue({
        ...newThreshold,
        id: 1,
      });

      const result = await mediator.createEditThresholds(createDto);

      expect(thresholdService.create).toHaveBeenCalledWith({
        exam_passing_grade: 0,
        weight_soft: 0,
        weight_tech: 0,
        primary_passing_grade: 0,
        secondary_passing_grade: 0,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(result).toEqual({
        message: 'Threshold created successfully',
        threshold: expect.objectContaining({
          id: 1,
          examPassingGrade: 0,
          weightSoft: 0,
          weightTech: 0,
          primaryPassingGrade: 0,
          secondaryPassingGrade: 0,
        }),
      });
    });
  });

  describe('mediator structure', () => {
    it('should be injectable', () => {
      expect(mediator).toBeDefined();
    });

    it('should have proper constructor injection', () => {
      expect(thresholdService).toBeDefined();
      expect(applicationService).toBeDefined();
    });

    it('should have createEditThresholds method', () => {
      expect(mediator.createEditThresholds).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject ThresholdService', () => {
      expect(thresholdService).toBeDefined();
    });

    it('should inject ApplicationService', () => {
      expect(applicationService).toBeDefined();
    });

    it('should have access to service methods', () => {
      expect(thresholdService.findOne).toBeDefined();
      expect(thresholdService.save).toBeDefined();
      expect(thresholdService.create).toBeDefined();
    });
  });

  describe('mediator metadata', () => {
    it('should be a valid NestJS injectable', () => {
      expect(mediator).toBeDefined();
    });

    it('should have proper service dependencies', () => {
      expect(thresholdService).toBeDefined();
      expect(applicationService).toBeDefined();
    });
  });
});
