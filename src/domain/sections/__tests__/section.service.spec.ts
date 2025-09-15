import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from '../section.service';
import { SectionRepository } from '../section.repository';
import { Sections } from '../../../core/data/database/entities/section.entity';
import { GlobalEntities } from '../../../core/data/types';

describe('SectionService', () => {
  let service: SectionService;
  let repository: SectionRepository;
  let module: TestingModule;

  const mockSectionRepository = {
    getAll: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    getQueryBuilder: jest.fn(),
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
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        SectionService,
        {
          provide: SectionRepository,
          useValue: mockSectionRepository,
        },
      ],
    }).compile();

    service = module.get<SectionService>(SectionService);
    repository = module.get<SectionRepository>(SectionRepository);
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

  describe('service instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of SectionService', () => {
      expect(service).toBeInstanceOf(SectionService);
    });

    it('should have repository dependency injected', () => {
      expect(service['sectionRepository']).toBeDefined();
      expect(service['sectionRepository']).toBe(repository);
    });

    it('should have all required methods from BaseService', () => {
      expect(typeof service.getAll).toBe('function');
      expect(typeof service.findOne).toBe('function');
      expect(typeof service.findMany).toBe('function');
      expect(typeof service.findAndCount).toBe('function');
      expect(typeof service.create).toBe('function');
      expect(typeof service.update).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.save).toBe('function');
      expect(typeof service.getQueryBuilder).toBe('function');
    });
  });

  describe('getAll', () => {
    it('should return all sections', async () => {
      const mockSections = [mockSection, mockSection];
      mockSectionRepository.getAll.mockResolvedValue(mockSections);

      const result = await service.getAll();

      expect(result).toEqual(mockSections);
      expect(mockSectionRepository.getAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockSectionRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(mockSectionRepository.getAll).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockSectionRepository.getAll.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow('Database error');
      expect(mockSectionRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one section by criteria', async () => {
      const whereCriteria = { id: 1 };
      const relations: GlobalEntities[] = ['sectionCycle'];
      const selects = { id: true, name: true, days: true };

      mockSectionRepository.findOne.mockResolvedValue(mockSection);

      const result = await service.findOne(whereCriteria, relations, selects);

      expect(result).toEqual(mockSection);
      expect(mockSectionRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          relations,
          select: selects,
        })
      );
    });

    it('should return null when no section found', async () => {
      const whereCriteria = { id: 999 };
      mockSectionRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(whereCriteria);

      expect(result).toBeNull();
      expect(mockSectionRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('should find multiple sections', async () => {
      const whereCriteria = { name: 'Test Section' };
      const mockSections = [mockSection, mockSection];

      mockSectionRepository.findMany.mockResolvedValue(mockSections);

      const result = await service.findMany(whereCriteria);

      expect(result).toEqual(mockSections);
      expect(mockSectionRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
        })
      );
    });
  });

  describe('findAndCount', () => {
    it('should find sections with count and pagination', async () => {
      const whereCriteria = { name: 'Test Section' };
      const mockSections = [mockSection];
      const mockResult: [Partial<Sections>[], number] = [mockSections, 1];

      mockSectionRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await service.findAndCount(whereCriteria, [], { id: true, name: true }, 0, 10);

      expect(result).toEqual(mockResult);
      expect(mockSectionRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          skip: 0,
          take: 10,
        })
      );
    });
  });

  describe('create', () => {
    it('should create a new section', () => {
      const createData = {
        name: 'New Section',
        days: 'Tuesday, Thursday',
        course_time_start: new Date('2024-01-01T10:00:00Z'),
        course_time_end: new Date('2024-01-01T12:00:00Z'),
      };

      mockSectionRepository.create.mockReturnValue(createData);

      const result = service.create(createData);

      expect(result).toEqual(createData);
      expect(mockSectionRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const criteria = { id: 1 };
      const updateData = { name: 'Updated Section' };
      const mockUpdateResult = { affected: 1 };

      mockSectionRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockSectionRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a section', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockSectionRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockSectionRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single section', async () => {
      const saveData = mockSection;
      mockSectionRepository.save.mockResolvedValue(saveData);

      const result = await service.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockSectionRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple sections', async () => {
      const saveData = [mockSection, mockSection];
      mockSectionRepository.save.mockResolvedValue(saveData);

      const result = await service.save(...saveData);

      expect(result).toEqual(saveData);
      expect(mockSectionRepository.save).toHaveBeenCalledWith(...saveData);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockSectionRepository.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockSectionRepository.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
