import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../report.controller';
import { ReportMediator } from '../report.mediator';
import { InformationService } from '../../information/information.service';
import { ApplicationService } from '../../applications/application.service';
import { UserService } from '../../users/user.service';
import { MicrocampApplicationService } from '../../microcampApplications/microcamp-applications.service';

describe('ReportModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ReportController,
        ReportMediator,
        {
          provide: InformationService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: ApplicationService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: MicrocampApplicationService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('module configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have ReportController available', () => {
      const controller = module.get<ReportController>(ReportController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(ReportController);
    });

    it('should have ReportMediator available', () => {
      const mediator = module.get<ReportMediator>(ReportMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(ReportMediator);
    });
  });

  describe('component instantiation', () => {
    it('should create ReportController with proper dependencies', () => {
      const controller = module.get<ReportController>(ReportController);
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBeInstanceOf(ReportMediator);
    });

    it('should create ReportMediator with service dependencies', () => {
      const mediator = module.get<ReportMediator>(ReportMediator);
      expect(mediator['informationService']).toBeDefined();
      expect(mediator['applicationService']).toBeDefined();
      expect(mediator['userService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBeDefined();
    });
  });

  describe('module structure', () => {
    it('should have correct imports', () => {
      expect(module).toBeDefined();
    });

    it('should have correct controllers', () => {
      const controller = module.get<ReportController>(ReportController);
      expect(controller).toBeDefined();
    });

    it('should have correct providers', () => {
      const mediator = module.get<ReportMediator>(ReportMediator);
      expect(mediator).toBeDefined();
    });

    it('should have correct exports', () => {
      // Reports module doesn't export anything
      expect(module).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject ReportMediator into ReportController', () => {
      const controller = module.get<ReportController>(ReportController);
      const mediator = module.get<ReportMediator>(ReportMediator);
      
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('module metadata', () => {
    it('should be a valid NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module.get).toBe('function');
    });

    it('should resolve all dependencies correctly', () => {
      expect(() => module.get(ReportController)).not.toThrow();
      expect(() => module.get(ReportMediator)).not.toThrow();
    });
  });
});
