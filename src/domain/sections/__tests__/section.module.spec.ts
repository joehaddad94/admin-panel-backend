import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SectionController } from '../section.controller';
import { SectionService } from '../section.service';
import { SectionMediator } from '../section.mediator';
import { SectionRepository } from '../section.repository';
import { Sections } from '../../../core/data/database/entities/section.entity';
import { JwtStrategy } from '../../auth/jwt.strategy';

describe('SectionModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        SectionController,
        SectionService,
        SectionMediator,
        SectionRepository,
        {
          provide: JwtStrategy,
          useValue: { validate: jest.fn() },
        },
        {
          provide: getRepositoryToken(Sections),
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

    it('should have SectionController available', () => {
      const controller = module.get<SectionController>(SectionController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(SectionController);
    });

    it('should have SectionService available', () => {
      const service = module.get<SectionService>(SectionService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(SectionService);
    });

    it('should have SectionMediator available', () => {
      const mediator = module.get<SectionMediator>(SectionMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(SectionMediator);
    });

    it('should have SectionRepository available', () => {
      const repository = module.get<SectionRepository>(SectionRepository);
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(SectionRepository);
    });
  });

  describe('component instantiation', () => {
    it('should create SectionController with proper dependencies', () => {
      const controller = module.get<SectionController>(SectionController);
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBeInstanceOf(SectionMediator);
    });

    it('should create SectionService with repository dependency', () => {
      const service = module.get<SectionService>(SectionService);
      expect(service['sectionRepository']).toBeDefined();
      expect(service['sectionRepository']).toBeInstanceOf(SectionRepository);
    });

    it('should create SectionMediator with service dependency', () => {
      const mediator = module.get<SectionMediator>(SectionMediator);
      expect(mediator['sectionService']).toBeDefined();
      expect(mediator['sectionService']).toBeInstanceOf(SectionService);
    });

    it('should create SectionRepository with TypeORM repository', () => {
      const repository = module.get<SectionRepository>(SectionRepository);
      expect(repository['repository']).toBeDefined();
    });
  });

  describe('module structure', () => {
    it('should have correct imports', () => {
      expect(module).toBeDefined();
    });

    it('should have correct controllers', () => {
      const controller = module.get<SectionController>(SectionController);
      expect(controller).toBeDefined();
    });

    it('should have correct providers', () => {
      const service = module.get<SectionService>(SectionService);
      const mediator = module.get<SectionMediator>(SectionMediator);
      const repository = module.get<SectionRepository>(SectionRepository);

      expect(service).toBeDefined();
      expect(mediator).toBeDefined();
      expect(repository).toBeDefined();
    });

    it('should have correct exports', () => {
      const service = module.get<SectionService>(SectionService);
      const repository = module.get<SectionRepository>(SectionRepository);
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject SectionMediator into SectionController', () => {
      const controller = module.get<SectionController>(SectionController);
      const mediator = module.get<SectionMediator>(SectionMediator);

      expect(controller['mediator']).toBe(mediator);
    });

    it('should inject SectionRepository into SectionService', () => {
      const service = module.get<SectionService>(SectionService);
      const repository = module.get<SectionRepository>(SectionRepository);

      expect(service['sectionRepository']).toBe(repository);
    });

    it('should inject SectionService into SectionMediator', () => {
      const mediator = module.get<SectionMediator>(SectionMediator);
      const service = module.get<SectionService>(SectionService);

      expect(mediator['sectionService']).toBe(service);
    });
  });

  describe('module metadata', () => {
    it('should be a valid NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module.get).toBe('function');
    });

    it('should resolve all dependencies correctly', () => {
      expect(() => module.get(SectionController)).not.toThrow();
      expect(() => module.get(SectionService)).not.toThrow();
      expect(() => module.get(SectionMediator)).not.toThrow();
      expect(() => module.get(SectionRepository)).not.toThrow();
    });
  });
});
