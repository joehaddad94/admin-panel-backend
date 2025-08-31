import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../statistics.controller';
import { StatisticsMediator } from '../statistics.mediator';
import { StatisticsQueryDto } from '../dtos/statistics.dto';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let mediator: StatisticsMediator;
  let module: TestingModule;

  const mockStatisticsMediator = {
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsMediator,
          useValue: mockStatisticsMediator,
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    mediator = module.get<StatisticsMediator>(StatisticsMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics', () => {
    it('should return statistics data', async () => {
      const queryDto: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockStatistics = {
        data: {
          applicationStatusCounts: [],
          eligibilityStatistics: {},
        },
      };

      mockStatisticsMediator.getStatistics.mockResolvedValue(mockStatistics);

      const result = await controller.getStatistics(queryDto);

      expect(mediator.getStatistics).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockStatistics);
    });

    it('should handle empty query parameters', async () => {
      const queryDto: StatisticsQueryDto = {};
      const mockStatistics = {
        data: {
          applicationStatusCounts: [],
        },
      };

      mockStatisticsMediator.getStatistics.mockResolvedValue(mockStatistics);

      const result = await controller.getStatistics(queryDto);

      expect(mediator.getStatistics).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockStatistics);
    });
  });
});
