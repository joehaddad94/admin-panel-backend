import { Test, TestingModule } from '@nestjs/testing';
import { ThresholdController } from '../threshold.controller';
import { ThresholdMediator } from '../threshold.mediator';
import { CreateEditThresholdsDto } from '../dtos/create-edit.dto';

describe('ThresholdController', () => {
  let controller: ThresholdController;
  let mediator: ThresholdMediator;
  let module: TestingModule;

  const mockThresholdMediator = {
    createEditThresholds: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ThresholdController],
      providers: [
        {
          provide: ThresholdMediator,
          useValue: mockThresholdMediator,
        },
      ],
    }).compile();

    controller = module.get<ThresholdController>(ThresholdController);
    mediator = module.get<ThresholdMediator>(ThresholdMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEditThreshold', () => {
    it('should create a new threshold', async () => {
      const createDto: CreateEditThresholdsDto = {
        cycleId: 1,
        examPassingGrade: 70,
        weightSoft: 0.3,
        weightTech: 0.7,
        primaryPassingGrade: 15,
        secondaryPassingGrade: 12,
      };

      const mockResponse = {
        message: 'Threshold created successfully',
        threshold: {
          id: 1,
          examPassingGrade: 70,
          weightSoft: 0.3,
          weightTech: 0.7,
          primaryPassingGrade: 15,
          secondaryPassingGrade: 12,
        },
      };

      mockThresholdMediator.createEditThresholds.mockResolvedValue(mockResponse);

      const result = await controller.createEditThreshold(createDto);

      expect(mediator.createEditThresholds).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResponse);
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

      const mockResponse = {
        message: 'Threshold updated successfully',
        threshold: {
          id: 1,
          examPassingGrade: 75,
          weightSoft: 0.4,
          weightTech: 0.6,
          primaryPassingGrade: 16,
          secondaryPassingGrade: 13,
        },
      };

      mockThresholdMediator.createEditThresholds.mockResolvedValue(mockResponse);

      const result = await controller.createEditThreshold(updateDto);

      expect(mediator.createEditThresholds).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: CreateEditThresholdsDto = {
        thresholdId: 1,
        cycleId: 1,
        examPassingGrade: 80,
        // Only updating examPassingGrade, other fields remain null
      };

      const mockResponse = {
        message: 'Threshold updated successfully',
        threshold: {
          id: 1,
          examPassingGrade: 80,
          weightSoft: 0.3,
          weightTech: 0.7,
          primaryPassingGrade: 15,
          secondaryPassingGrade: 12,
        },
      };

      mockThresholdMediator.createEditThresholds.mockResolvedValue(mockResponse);

      const result = await controller.createEditThreshold(partialUpdateDto);

      expect(mediator.createEditThresholds).toHaveBeenCalledWith(partialUpdateDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
