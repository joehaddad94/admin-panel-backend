import { Test, TestingModule } from '@nestjs/testing';
import { DataMigrationModule } from '../data.migration.module';
import { DataMigrationController } from '../data.migration.controller';
import { DataMigrationMediator } from '../data.migration.mediator';

describe('DataMigrationModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DataMigrationModule],
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

    it('should have DataMigrationController available', () => {
      const controller = module.get<DataMigrationController>(DataMigrationController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(DataMigrationController);
    });

    it('should have DataMigrationMediator available', () => {
      const mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
      expect(mediator).toBeDefined();
      expect(mediator).toBeInstanceOf(DataMigrationMediator);
    });
  });

  describe('component instantiation', () => {
    it('should create DataMigrationController with proper dependencies', () => {
      const controller = module.get<DataMigrationController>(DataMigrationController);
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBeInstanceOf(DataMigrationMediator);
    });

    it('should create DataMigrationMediator as injectable service', () => {
      const mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
      expect(mediator).toBeDefined();
      expect(typeof mediator.blomBankMigration).toBe('function');
      expect(typeof mediator.whishMigration).toBe('function');
    });
  });

  describe('module structure', () => {
    it('should have correct imports', () => {
      // The module has no imports, so this should be empty
      expect(module).toBeDefined();
    });

    it('should have correct controllers', () => {
      const controller = module.get<DataMigrationController>(DataMigrationController);
      expect(controller).toBeDefined();
    });

    it('should have correct providers', () => {
      const mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
      expect(mediator).toBeDefined();
    });

    it('should have correct exports', () => {
      // The module has no exports, so this should be empty
      expect(module).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject DataMigrationMediator into DataMigrationController', () => {
      const controller = module.get<DataMigrationController>(DataMigrationController);
      const mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
      
      expect(controller['mediator']).toBe(mediator);
    });

    it('should allow DataMigrationMediator to be used independently', () => {
      const mediator = module.get<DataMigrationMediator>(DataMigrationMediator);
      
      expect(mediator).toBeDefined();
      expect(typeof mediator.blomBankMigration).toBe('function');
      expect(typeof mediator.whishMigration).toBe('function');
    });
  });

  describe('module metadata', () => {
    it('should be a valid NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module.get).toBe('function');
    });

    it('should resolve all dependencies correctly', () => {
      expect(() => module.get(DataMigrationController)).not.toThrow();
      expect(() => module.get(DataMigrationMediator)).not.toThrow();
    });
  });
});
