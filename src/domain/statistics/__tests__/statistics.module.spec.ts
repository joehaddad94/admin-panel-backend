import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../statistics.controller';
import { StatisticsService } from '../statistics.service';
import { StatisticsMediator } from '../statistics.mediator';
import { DataSource } from 'typeorm';
import { ProgramService } from '../../programs/program.service';

describe('StatisticsModule', () => {
  let module: TestingModule;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        StatisticsController,
        StatisticsService,
        StatisticsMediator,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ProgramService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have StatisticsController defined', () => {
    const controller = module.get<StatisticsController>(StatisticsController);
    expect(controller).toBeDefined();
  });

  it('should have StatisticsService defined', () => {
    const service = module.get<StatisticsService>(StatisticsService);
    expect(service).toBeDefined();
  });

  it('should have StatisticsMediator defined', () => {
    const mediator = module.get<StatisticsMediator>(StatisticsMediator);
    expect(mediator).toBeDefined();
  });
});
