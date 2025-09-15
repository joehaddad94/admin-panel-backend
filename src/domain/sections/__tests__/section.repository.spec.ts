import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionRepository } from '../section.repository';
import { Sections } from '../../../core/data/database/entities/section.entity';

describe('SectionRepository', () => {
  let repository: SectionRepository;
  let typeOrmRepository: Repository<Sections>;
  let module: TestingModule;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
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
        SectionRepository,
        {
          provide: getRepositoryToken(Sections),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<SectionRepository>(SectionRepository);
    typeOrmRepository = module.get<Repository<Sections>>(getRepositoryToken(Sections));
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

  describe('repository instantiation', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should be an instance of SectionRepository', () => {
      expect(repository).toBeInstanceOf(SectionRepository);
    });

    it('should have TypeORM repository injected', () => {
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(typeOrmRepository);
    });

    it('should have all required methods from BaseRepository', () => {
      expect(typeof repository.getAll).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.getQueryBuilder).toBe('function');
    });
  });

  describe('getAll', () => {
    it('should return all sections', async () => {
      const mockSections = [mockSection, mockSection];
      mockTypeOrmRepository.find.mockResolvedValue(mockSections);

      const result = await repository.getAll();

      expect(result).toEqual(mockSections);
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(result).toEqual([]);
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockTypeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow('Database error');
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one section with options', async () => {
      const options = {
        where: { id: 1 },
        relations: ['sectionCycle'],
        select: { id: true, name: true, days: true },
      };

      mockTypeOrmRepository.findOne.mockResolvedValue(mockSection);

      const result = await repository.findOne(options);

      expect(result).toEqual(mockSection);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null when no section found', async () => {
      const options = { where: { id: 999 } };
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne(options);

      expect(result).toBeNull();
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('findMany', () => {
    it('should find multiple sections with options', async () => {
      const options = {
        where: { name: 'Test Section' },
        order: { created_at: 'DESC' as const },
      };
      const mockSections = [mockSection, mockSection];

      mockTypeOrmRepository.find.mockResolvedValue(mockSections);

      const result = await repository.findMany(options);

      expect(result).toEqual(mockSections);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('findAndCount', () => {
    it('should find sections with count', async () => {
      const options = {
        where: { name: 'Test Section' },
        skip: 0,
        take: 10,
      };
      const mockSections = [mockSection];
      const mockResult: [Partial<Sections>[], number] = [mockSections, 1];

      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await repository.findAndCount(options);

      expect(result).toEqual(mockResult);
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith(options);
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

      mockTypeOrmRepository.create.mockReturnValue(createData);

      const result = repository.create(createData);

      expect(result).toEqual(createData);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const criteria = { id: 1 };
      const updateData = { name: 'Updated Section' };
      const mockUpdateResult = { affected: 1 };

      mockTypeOrmRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await repository.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a section', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockTypeOrmRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await repository.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single section', async () => {
      const saveData = mockSection;
      mockTypeOrmRepository.save.mockResolvedValue(saveData);

      const result = await repository.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple sections', async () => {
      const saveData = [mockSection, mockSection];
      mockTypeOrmRepository.save.mockResolvedValue(saveData);

      const result = await repository.save(...saveData);

      expect(result).toEqual(saveData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(saveData);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('repository structure', () => {
    it('should extend BaseRepository', () => {
      expect(repository).toBeInstanceOf(SectionRepository);
    });

    it('should have proper constructor injection', () => {
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(typeOrmRepository);
    });
  });
});
