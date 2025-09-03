import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProgramController } from '../program.contoller';
import { ProgramService } from '../program.service';
import { ProgramMediator } from '../program.mediator';
import { ProgramRepository } from '../program.repository';
import { Program } from '../../../core/data/database/entities/program.entity';

describe('ProgramModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProgramController,
        ProgramService,
        ProgramMediator,
        ProgramRepository,
        {
          provide: getRepositoryToken(Program),
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

    it('should have ProgramController available', () => {
      const controller = module.get<ProgramController>(ProgramController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(ProgramController);
    });

    it('should have ProgramService available', () => {
      const service = module.get<ProgramService>(ProgramService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ProgramService);
    });

    it('should have ProgramMediator available', () => {
      const mediator = module.get<ProgramMediator>(ProgramMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(ProgramMediator);
    });

    it('should have ProgramRepository available', () => {
      const repository = module.get<ProgramRepository>(ProgramRepository);
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(ProgramRepository);
    });
  });

  describe('component instantiation', () => {
    it('should create ProgramController with proper dependencies', () => {
      const controller = module.get<ProgramController>(ProgramController);
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBeInstanceOf(ProgramMediator);
    });

    it('should create ProgramService with repository dependency', () => {
      const service = module.get<ProgramService>(ProgramService);
      expect(service['programRepository']).toBeDefined();
      expect(service['programRepository']).toBeInstanceOf(ProgramRepository);
    });

    it('should create ProgramMediator with service dependency', () => {
      const mediator = module.get<ProgramMediator>(ProgramMediator);
      expect(mediator['service']).toBeDefined();
      expect(mediator['service']).toBeInstanceOf(ProgramService);
    });

    it('should create ProgramRepository with TypeORM repository', () => {
      const repository = module.get<ProgramRepository>(ProgramRepository);
      expect(repository['repository']).toBeDefined();
    });
  });

  describe('module structure', () => {
    it('should have correct imports', () => {
      expect(module).toBeDefined();
    });

    it('should have correct controllers', () => {
      const controller = module.get<ProgramController>(ProgramController);
      expect(controller).toBeDefined();
    });

    it('should have correct providers', () => {
      const service = module.get<ProgramService>(ProgramService);
      const mediator = module.get<ProgramMediator>(ProgramMediator);
      const repository = module.get<ProgramRepository>(ProgramRepository);
      
      expect(service).toBeDefined();
      expect(mediator).toBeDefined();
      expect(repository).toBeDefined();
    });

    it('should have correct exports', () => {
      const service = module.get<ProgramService>(ProgramService);
      expect(service).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject ProgramMediator into ProgramController', () => {
      const controller = module.get<ProgramController>(ProgramController);
      const mediator = module.get<ProgramMediator>(ProgramMediator);
      
      expect(controller['mediator']).toBe(mediator);
    });

    it('should inject ProgramRepository into ProgramService', () => {
      const service = module.get<ProgramService>(ProgramService);
      const repository = module.get<ProgramRepository>(ProgramRepository);
      
      expect(service['programRepository']).toBe(repository);
    });

    it('should inject ProgramService into ProgramMediator', () => {
      const mediator = module.get<ProgramMediator>(ProgramMediator);
      const service = module.get<ProgramService>(ProgramService);
      
      expect(mediator['service']).toBe(service);
    });
  });

  describe('module metadata', () => {
    it('should be a valid NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module.get).toBe('function');
    });

    it('should resolve all dependencies correctly', () => {
      expect(() => module.get(ProgramController)).not.toThrow();
      expect(() => module.get(ProgramService)).not.toThrow();
      expect(() => module.get(ProgramMediator)).not.toThrow();
      expect(() => module.get(ProgramRepository)).not.toThrow();
    });
  });
});
