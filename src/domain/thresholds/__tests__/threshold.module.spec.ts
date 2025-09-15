import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThresholdController } from '../threshold.controller';
import { ThresholdService } from '../threshold.service';
import { ThresholdMediator } from '../threshold.mediator';
import { ThresholdRepository } from '../threshold.repository';
import { Threshold } from '../../../core/data/database/entities/threshold.entity';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { ApplicationService } from '../../applications/application.service';

describe('ThresholdModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThresholdController,
        ThresholdService,
        ThresholdMediator,
        ThresholdRepository,
        JwtStrategy,
        {
          provide: getRepositoryToken(Threshold),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: ApplicationService,
          useValue: {
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ThresholdController defined', () => {
    const controller = module.get<ThresholdController>(ThresholdController);
    expect(controller).toBeDefined();
  });

  it('should have ThresholdService defined', () => {
    const service = module.get<ThresholdService>(ThresholdService);
    expect(service).toBeDefined();
  });

  it('should have ThresholdMediator defined', () => {
    const mediator = module.get<ThresholdMediator>(ThresholdMediator);
    expect(mediator).toBeDefined();
  });

  it('should have ThresholdRepository defined', () => {
    const repository = module.get<ThresholdRepository>(ThresholdRepository);
    expect(repository).toBeDefined();
  });
});
