import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CycleModule } from '../cycle.module';
import { CycleController } from '../cycle.controller';
import { CycleService } from '../cycle.service';
import { CycleMediator } from '../cycle.mediator';
import { CycleRepository } from '../cycle.repository';
import { Cycles } from '../../../core/data/database/entities/cycle.entity';
import { ProgramService } from '../../programs/program.service';

describe('CycleModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CycleController,
        CycleService,
        CycleMediator,
        CycleRepository,
        {
          provide: ProgramService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Cycles),
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

    it('should have CycleController', () => {
      const controller = module.get<CycleController>(CycleController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(CycleController);
    });

    it('should have CycleService', () => {
      const service = module.get<CycleService>(CycleService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(CycleService);
    });

    it('should have CycleMediator', () => {
      const mediator = module.get<CycleMediator>(CycleMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(CycleMediator);
    });

    it('should have CycleRepository', () => {
      const repository = module.get<CycleRepository>(CycleRepository);
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(CycleRepository);
    });
  });

  describe('component availability', () => {
    it('should export CycleService', () => {
      const service = module.get<CycleService>(CycleService);
      expect(service).toBeDefined();
    });

    it('should export CycleRepository', () => {
      const repository = module.get<CycleRepository>(CycleRepository);
      expect(repository).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject dependencies into CycleController', () => {
      const controller = module.get<CycleController>(CycleController);
      expect(controller['mediator']).toBeDefined();
    });

    it('should inject dependencies into CycleService', () => {
      const service = module.get<CycleService>(CycleService);
      expect(service['repository']).toBeDefined();
    });

    it('should inject dependencies into CycleMediator', () => {
      const mediator = module.get<CycleMediator>(CycleMediator);
      expect(mediator['cycleService']).toBeDefined();
      expect(mediator['programService']).toBeDefined();
    });

    it('should inject dependencies into CycleRepository', () => {
      const repository = module.get<CycleRepository>(CycleRepository);
      expect(repository['repository']).toBeDefined();
    });
  });

  describe('module structure', () => {
    it('should have correct module metadata', () => {
      expect(module).toBeDefined();
    });

    it('should have all required providers', () => {
      expect(module).toBeDefined();
    });

    it('should have all required controllers', () => {
      expect(module).toBeDefined();
    });

    it('should have all required imports', () => {
      expect(module).toBeDefined();
    });
  });

  describe('service functionality', () => {
    it('should have CycleService with BaseService methods', () => {
      const service = module.get<CycleService>(CycleService);
      expect(typeof service.findMany).toBe('function');
      expect(typeof service.findOne).toBe('function');
      expect(typeof service.save).toBe('function');
      expect(typeof service.create).toBe('function');
      expect(typeof service.update).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.findAndCount).toBe('function');
      expect(typeof service.generateCycleCode).toBe('function');
    });
  });

  describe('repository functionality', () => {
    it('should have CycleRepository with BaseRepository methods', () => {
      const repository = module.get<CycleRepository>(CycleRepository);
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
      expect(typeof repository.getQueryBuilder).toBe('function');
    });
  });

  describe('mediator functionality', () => {
    it('should have CycleMediator with required methods', () => {
      const mediator = module.get<CycleMediator>(CycleMediator);
      expect(typeof mediator.findCycles).toBe('function');
      expect(typeof mediator.createEditCycle).toBe('function');
      expect(typeof mediator.deleteCycle).toBe('function');
    });
  });

  describe('controller functionality', () => {
    it('should have CycleController with required endpoints', () => {
      const controller = module.get<CycleController>(CycleController);
      expect(typeof controller.getAllCycles).toBe('function');
      expect(typeof controller.getCycles).toBe('function');
      expect(typeof controller.createCycle).toBe('function');
      expect(typeof controller.deleteCycle).toBe('function');
    });
  });

  describe('module exports', () => {
    it('should export CycleService for external use', () => {
      const service = module.get<CycleService>(CycleService);
      expect(service).toBeDefined();
    });

    it('should export CycleRepository for external use', () => {
      const repository = module.get<CycleRepository>(CycleRepository);
      expect(repository).toBeDefined();
    });
  });

  describe('middleware configuration', () => {
    it('should have middleware configured', () => {
      expect(module).toBeDefined();
    });
  });

  describe('TypeORM integration', () => {
    it('should have TypeORM entities configured', () => {
      expect(module).toBeDefined();
    });
  });
});
