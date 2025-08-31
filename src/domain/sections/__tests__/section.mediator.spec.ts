import { Test, TestingModule } from '@nestjs/testing';
import { SectionMediator } from '../section.mediator';
import { SectionService } from '../section.service';
import { Sections } from '../../../core/data/database/entities/section.entity';
import { Cycles } from '../../../core/data/database/entities/cycle.entity';
import { CreateEditSectionDto } from '../dtos/createEditSection.dtos';
import { SectionCycle } from '../../../core/data/database/relations/section-cycle.entity';

// Mock SectionCycle
jest.mock('../../../core/data/database/relations/section-cycle.entity', () => {
  const mockSectionCycle = jest.fn().mockImplementation(() => ({
    cycle_id: 1,
    save: jest.fn().mockResolvedValue({ id: 1, cycle_id: 1 }),
  }));
  
  return {
    SectionCycle: Object.assign(mockSectionCycle, {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    }),
  };
});

describe('SectionMediator', () => {
  let mediator: SectionMediator;
  let service: SectionService;
  let module: TestingModule;

  const mockSectionService = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  const mockSection: Partial<Sections> = {
    id: 1,
    name: 'Test Section',
    days: 'Monday, Wednesday, Friday',
    course_time_start: new Date('2024-01-01T09:00:00Z'),
    course_time_end: new Date('2024-01-01T11:00:00Z'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
    sectionCycle: {
      id: 1,
      cycle_id: 1,
      cycle: {
        id: 1,
        name: 'Test Cycle',
        code: 'TC001',
        from_date: new Date('2024-01-01'),
        to_date: new Date('2024-12-31'),
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: 1,
        updated_by_id: 1,
      } as Partial<Cycles>,
    } as any,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        SectionMediator,
        {
          provide: SectionService,
          useValue: mockSectionService,
        },
      ],
    }).compile();

    mediator = module.get<SectionMediator>(SectionMediator);
    service = module.get<SectionService>(SectionService);
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

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of SectionMediator', () => {
      expect(mediator).toBeInstanceOf(SectionMediator);
    });

    it('should have service dependency injected', () => {
      expect(mediator['sectionService']).toBeDefined();
      expect(mediator['sectionService']).toBe(service);
    });
  });

  describe('mediator structure', () => {
    it('should be injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['sectionService']).toBeDefined();
    });

    it('should have all mediator methods', () => {
      expect(typeof mediator.findSections).toBe('function');
      expect(typeof mediator.createEditSection).toBe('function');
      expect(typeof mediator.deleteCycles).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject SectionService', () => {
      expect(mediator['sectionService']).toBe(service);
    });

    it('should have access to service methods', () => {
      expect(mediator['sectionService']).toBeDefined();
      expect(typeof mediator['sectionService'].findAndCount).toBe('function');
      expect(typeof mediator['sectionService'].findOne).toBe('function');
      expect(typeof mediator['sectionService'].save).toBe('function');
      expect(typeof mediator['sectionService'].delete).toBe('function');
    });
  });

  describe('findSections method', () => {
    it('should find sections with cycleId', async () => {
      const cycleId = 1;
      const page = 1;
      const pageSize = 10;
      const mockSections = [mockSection];
      const mockResult: [Partial<Sections>[], number] = [mockSections, 1];

      mockSectionService.findAndCount.mockResolvedValue(mockResult);

      const result = await mediator.findSections(cycleId, page, pageSize);

      expect(result).toBeDefined();
      expect(mockSectionService.findAndCount).toHaveBeenCalled();
    });

    it('should find sections without cycleId', async () => {
      const mockSections = [mockSection];
      const mockResult: [Partial<Sections>[], number] = [mockSections, 1];

      mockSectionService.findAndCount.mockResolvedValue(mockResult);

      const result = await mediator.findSections();

      expect(result).toBeDefined();
      expect(mockSectionService.findAndCount).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const mockResult: [Partial<Sections>[], number] = [[], 0];

      mockSectionService.findAndCount.mockResolvedValue(mockResult);

      const result = await mediator.findSections();

      expect(result).toBeDefined();
      expect(mockSectionService.findAndCount).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockSectionService.findAndCount.mockRejectedValue(error);

      await expect(mediator.findSections()).rejects.toThrow('Service error');
      expect(mockSectionService.findAndCount).toHaveBeenCalled();
    });
  });

  describe('createEditSection method', () => {
    it('should create a new section', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionName: 'New Section',
        cycleId: 1,
        days: 'Tuesday, Thursday',
        courseTimeStart: new Date('2024-01-01T10:00:00Z'),
        courseTimeEnd: new Date('2024-01-01T12:00:00Z'),
      };

      mockSectionService.findOne.mockResolvedValue(null);
      mockSectionService.create.mockReturnValue(mockSection);
      mockSectionService.save.mockResolvedValue(mockSection);
      // Mock the second findOne call that gets the saved section
      mockSectionService.findOne
        .mockResolvedValueOnce(null) // First call for existing section check
        .mockResolvedValueOnce(mockSection); // Second call for getting saved section

      const result = await mediator.createEditSection(createEditSectionDto);

      expect(result).toBeDefined();
      expect(mockSectionService.findOne).toHaveBeenCalled();
      expect(mockSectionService.create).toHaveBeenCalled();
      expect(mockSectionService.save).toHaveBeenCalled();
    });

    it('should update an existing section', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionId: 1,
        sectionName: 'Updated Section',
        cycleId: 1,
        days: 'Monday, Wednesday',
        courseTimeStart: new Date('2024-01-01T08:00:00Z'),
        courseTimeEnd: new Date('2024-01-01T10:00:00Z'),
      };

      mockSectionService.findOne.mockResolvedValue(mockSection);
      mockSectionService.save.mockResolvedValue(mockSection);

      const result = await mediator.createEditSection(createEditSectionDto);

      expect(result).toBeDefined();
      expect(mockSectionService.findOne).toHaveBeenCalled();
      expect(mockSectionService.save).toHaveBeenCalled();
    });

    it('should handle duplicate section name error', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionName: 'Existing Section',
        cycleId: 1,
      };

      mockSectionService.findOne.mockResolvedValue(mockSection);

      await expect(mediator.createEditSection(createEditSectionDto)).rejects.toThrow('Cycle Name must be unique.');
      expect(mockSectionService.findOne).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const createEditSectionDto: CreateEditSectionDto = {
        sectionName: 'New Section',
        cycleId: 1,
      };

      const error = new Error('Service error');
      mockSectionService.findOne.mockRejectedValue(error);

      await expect(mediator.createEditSection(createEditSectionDto)).rejects.toThrow('Service error');
      expect(mockSectionService.findOne).toHaveBeenCalled();
    });
  });

  describe('deleteCycles method', () => {
    it('should delete single section', async () => {
      const sectionId = '1';
      const mockSections = [mockSection];

      mockSectionService.findMany.mockResolvedValue(mockSections);
      mockSectionService.delete.mockResolvedValue({ affected: 1 });

      const result = await mediator.deleteCycles(sectionId);

      expect(result).toBeDefined();
      expect(mockSectionService.findMany).toHaveBeenCalled();
      expect(mockSectionService.delete).toHaveBeenCalled();
    });

    it('should delete multiple sections', async () => {
      const sectionIds = ['1', '2', '3'];
      const mockSections = [mockSection, mockSection, mockSection];

      mockSectionService.findMany.mockResolvedValue(mockSections);
      mockSectionService.delete.mockResolvedValue({ affected: 3 });

      const result = await mediator.deleteCycles(sectionIds);

      expect(result).toBeDefined();
      expect(mockSectionService.findMany).toHaveBeenCalled();
      expect(mockSectionService.delete).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const sectionId = '1';
      const error = new Error('Service error');
      mockSectionService.findMany.mockRejectedValue(error);

      await expect(mediator.deleteCycles(sectionId)).rejects.toThrow('Service error');
      expect(mockSectionService.findMany).toHaveBeenCalled();
    });
  });

  describe('mediator metadata', () => {
    it('should be a valid NestJS injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper service dependency', () => {
      expect(mediator['sectionService']).toBeDefined();
      expect(mediator['sectionService']).toBe(service);
    });
  });
});
