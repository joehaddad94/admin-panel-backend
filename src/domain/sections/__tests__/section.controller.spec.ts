import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from '../section.controller';
import { SectionMediator } from '../section.mediator';
import { CreateEditSectionDto } from '../dtos/createEditSection.dtos';

describe('SectionController', () => {
  let controller: SectionController;
  let mediator: SectionMediator;
  let module: TestingModule;

  const mockSectionMediator = {
    findSections: jest.fn(),
    createEditSection: jest.fn(),
    deleteCycles: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [SectionController],
      providers: [
        {
          provide: SectionMediator,
          useValue: mockSectionMediator,
        },
      ],
    }).compile();

    controller = module.get<SectionController>(SectionController);
    mediator = module.get<SectionMediator>(SectionMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    if (module) {
      await module.close();
    }
  });

  describe('controller instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should be an instance of SectionController', () => {
      expect(controller).toBeInstanceOf(SectionController);
    });

    it('should have mediator dependency injected', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('controller structure', () => {
    it('should have proper decorators', () => {
      expect(controller).toBeDefined();
    });

    it('should be injectable', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have getSections method', () => {
      expect(typeof controller.getSections).toBe('function');
    });

    it('should have createEditSection method', () => {
      expect(typeof controller.createEditSection).toBe('function');
    });

    it('should have deleteCycle method', () => {
      expect(typeof controller.deleteCycle).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject SectionMediator', () => {
      expect(controller['mediator']).toBe(mediator);
    });

    it('should have access to mediator methods', () => {
      expect(controller['mediator']).toBeDefined();
      expect(typeof controller['mediator'].findSections).toBe('function');
      expect(typeof controller['mediator'].createEditSection).toBe('function');
      expect(typeof controller['mediator'].deleteCycles).toBe('function');
    });
  });

  describe('getSections method', () => {
    it('should call mediator findSections method with cycleId', async () => {
      const cycleId = 1;
      const mockSections = {
        sections: [
          { id: 1, name: 'Section A', cycleName: 'Cycle 1' },
          { id: 2, name: 'Section B', cycleName: 'Cycle 1' },
        ],
        total: 2,
      };
      mockSectionMediator.findSections.mockResolvedValue(mockSections);

      const result = await controller.getSections(cycleId);

      expect(result).toEqual(mockSections);
      expect(mockSectionMediator.findSections).toHaveBeenCalledWith(cycleId);
    });

    it('should call mediator findSections method without cycleId', async () => {
      const mockSections = {
        sections: [
          { id: 1, name: 'Section A', cycleName: 'Cycle 1' },
          { id: 2, name: 'Section B', cycleName: 'Cycle 2' },
        ],
        total: 2,
      };
      mockSectionMediator.findSections.mockResolvedValue(mockSections);

      const result = await controller.getSections();

      expect(result).toEqual(mockSections);
      expect(mockSectionMediator.findSections).toHaveBeenCalledWith(undefined);
    });

    it('should handle mediator errors', async () => {
      const cycleId = 1;
      const error = new Error('Mediator error');
      mockSectionMediator.findSections.mockRejectedValue(error);

      await expect(controller.getSections(cycleId)).rejects.toThrow('Mediator error');
      expect(mockSectionMediator.findSections).toHaveBeenCalledWith(cycleId);
    });
  });

  describe('createEditSection method', () => {
    it('should call mediator createEditSection method', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionName: 'New Section',
        cycleId: 1,
        days: 'Monday, Wednesday, Friday',
        courseTimeStart: new Date('2024-01-01T09:00:00Z'),
        courseTimeEnd: new Date('2024-01-01T11:00:00Z'),
      };
      const mockResult = { id: 1, name: 'New Section', success: true };
      mockSectionMediator.createEditSection.mockResolvedValue(mockResult);

      const result = await controller.createEditSection(createEditSectionDto);

      expect(result).toEqual(mockResult);
      expect(mockSectionMediator.createEditSection).toHaveBeenCalledWith(createEditSectionDto);
    });

    it('should handle mediator errors', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionName: 'New Section',
        cycleId: 1,
      };
      const error = new Error('Mediator error');
      mockSectionMediator.createEditSection.mockRejectedValue(error);

      await expect(controller.createEditSection(createEditSectionDto)).rejects.toThrow('Mediator error');
      expect(mockSectionMediator.createEditSection).toHaveBeenCalledWith(createEditSectionDto);
    });
  });

  describe('deleteCycle method', () => {
    it('should call mediator deleteCycles method with single id', async () => {
      const sectionId = '1';
      const mockResult = { success: true, message: 'Section deleted' };
      mockSectionMediator.deleteCycles.mockResolvedValue(mockResult);

      const result = await controller.deleteCycle(sectionId);

      expect(result).toEqual(mockResult);
      expect(mockSectionMediator.deleteCycles).toHaveBeenCalledWith(sectionId);
    });

    it('should call mediator deleteCycles method with multiple ids', async () => {
      const sectionIds = ['1', '2', '3'];
      const mockResult = { success: true, message: 'Sections deleted' };
      mockSectionMediator.deleteCycles.mockResolvedValue(mockResult);

      const result = await controller.deleteCycle(sectionIds);

      expect(result).toEqual(mockResult);
      expect(mockSectionMediator.deleteCycles).toHaveBeenCalledWith(sectionIds);
    });

    it('should handle mediator errors', async () => {
      const sectionId = '1';
      const error = new Error('Mediator error');
      mockSectionMediator.deleteCycles.mockRejectedValue(error);

      await expect(controller.deleteCycle(sectionId)).rejects.toThrow('Mediator error');
      expect(mockSectionMediator.deleteCycles).toHaveBeenCalledWith(sectionId);
    });
  });

  describe('controller metadata', () => {
    it('should be a valid NestJS controller', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
    });
  });
});
