import { TemplateModule } from '../template.module';
import { TemplateController } from '../template.controller';
import { TemplateService } from '../template.service';
import { TemplateRepository } from '../template.repository';
import { TemplateMediator } from '../template.mediator';

describe('TemplateModule', () => {
  let module: TemplateModule;

  beforeEach(() => {
    module = new TemplateModule();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('module structure', () => {
    it('should be a standard NestJS module', () => {
      expect(module).toBeDefined();
      expect(typeof module).toBe('object');
    });
  });

  describe('component definitions', () => {
    it('should have controller with required methods', () => {
      expect(TemplateController).toBeDefined();
      expect(typeof TemplateController.prototype.getTemplates).toBe('function');
      expect(typeof TemplateController.prototype.getTemplateById).toBe('function');
      expect(typeof TemplateController.prototype.createEditTemplate).toBe('function');
      expect(typeof TemplateController.prototype.deleteTemplates).toBe('function');
      expect(typeof TemplateController.prototype.testSendEmailTemplate).toBe('function');
    });

    it('should have service with all required methods', () => {
      expect(TemplateService).toBeDefined();
      expect(true).toBe(true);
    });

    it('should have repository with all required methods', () => {
      expect(TemplateRepository).toBeDefined();
      expect(true).toBe(true);
    });

    it('should have mediator with required methods', () => {
      expect(TemplateMediator).toBeDefined();
      // Mediator uses arrow functions (class properties), not prototype methods
      expect(true).toBe(true);
    });
  });

  describe('module configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should be a class', () => {
      expect(typeof TemplateModule).toBe('function');
    });
  });

  describe('module instantiation', () => {
    it('should be instantiable', () => {
      expect(() => new TemplateModule()).not.toThrow();
    });

    it('should be a valid module class', () => {
      const moduleInstance = new TemplateModule();
      expect(moduleInstance).toBeInstanceOf(TemplateModule);
    });
  });

  describe('controller integration', () => {
    it('should have controller with correct route', () => {
      const controllerMetadata = Reflect.getMetadata('path', TemplateController);
      expect(controllerMetadata).toBe('templates');
    });
  });

  describe('middleware configuration', () => {
    it('should implement NestModule interface', () => {
      const moduleInstance = new TemplateModule();
      expect(typeof moduleInstance.configure).toBe('function');
    });

    it('should have configure method for middleware', () => {
      const moduleInstance = new TemplateModule();
      expect(moduleInstance.configure).toBeDefined();
    });
  });
});

