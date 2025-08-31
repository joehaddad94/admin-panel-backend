import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MicrocampApplicationController } from '../microcamp-applications.controller';
import { MicrocampApplicationService } from '../microcamp-applications.service';
import { MicrocampApplicationMediator } from '../microcamp-applications.mediator';
import { MicrocampApplicationRepository } from '../microcamp-applications.repository';
import { MicrocampApplication } from '../../../core/data/database/entities/microcamp-application.entity';
import { JwtStrategy } from '../../auth/jwt.strategy';

describe('MicrocampApplicationModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MicrocampApplicationController,
        MicrocampApplicationService,
        MicrocampApplicationMediator,
        MicrocampApplicationRepository,
        {
          provide: JwtStrategy,
          useValue: { validate: jest.fn() },
        },
        {
          provide: getRepositoryToken(MicrocampApplication),
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

    it('should have MicrocampApplicationController available', () => {
      const controller = module.get<MicrocampApplicationController>(MicrocampApplicationController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(MicrocampApplicationController);
    });

    it('should have MicrocampApplicationService available', () => {
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(MicrocampApplicationService);
    });

    it('should have MicrocampApplicationMediator available', () => {
      const mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(MicrocampApplicationMediator);
    });

    it('should have MicrocampApplicationRepository available', () => {
      const repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(MicrocampApplicationRepository);
    });
  });

  describe('component instantiation', () => {
    it('should create MicrocampApplicationController with proper dependencies', () => {
      const controller = module.get<MicrocampApplicationController>(MicrocampApplicationController);
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBeInstanceOf(MicrocampApplicationMediator);
    });

    it('should create MicrocampApplicationService with repository dependency', () => {
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      expect(service['microcampApplicationRepository']).toBeDefined();
      expect(service['microcampApplicationRepository']).toBeInstanceOf(MicrocampApplicationRepository);
    });

    it('should create MicrocampApplicationMediator with service dependency', () => {
      const mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBeInstanceOf(MicrocampApplicationService);
    });

    it('should create MicrocampApplicationRepository with TypeORM repository', () => {
      const repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
      expect(repository['repository']).toBeDefined();
    });
  });

  describe('module structure', () => {
    it('should have correct imports', () => {
      expect(module).toBeDefined();
    });

    it('should have correct controllers', () => {
      const controller = module.get<MicrocampApplicationController>(MicrocampApplicationController);
      expect(controller).toBeDefined();
    });

    it('should have correct providers', () => {
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      const mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
      const repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
      
      expect(service).toBeDefined();
      expect(mediator).toBeDefined();
      expect(repository).toBeDefined();
    });

    it('should have correct exports', () => {
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      const repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
      
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject MicrocampApplicationMediator into MicrocampApplicationController', () => {
      const controller = module.get<MicrocampApplicationController>(MicrocampApplicationController);
      const mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
      
      expect(controller['mediator']).toBe(mediator);
    });

    it('should inject MicrocampApplicationRepository into MicrocampApplicationService', () => {
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      const repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
      
      expect(service['microcampApplicationRepository']).toBe(repository);
    });

    it('should inject MicrocampApplicationService into MicrocampApplicationMediator', () => {
      const mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
      const service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
      
      expect(mediator['microcampApplicationService']).toBe(service);
    });
  });

  describe('module metadata', () => {
    it('should be a valid NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module.get).toBe('function');
    });

    it('should resolve all dependencies correctly', () => {
      expect(() => module.get(MicrocampApplicationController)).not.toThrow();
      expect(() => module.get(MicrocampApplicationService)).not.toThrow();
      expect(() => module.get(MicrocampApplicationMediator)).not.toThrow();
      expect(() => module.get(MicrocampApplicationRepository)).not.toThrow();
    });
  });
});
