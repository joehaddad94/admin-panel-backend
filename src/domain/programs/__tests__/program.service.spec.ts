import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from '../program.service';
import { ProgramRepository } from '../program.repository';
import { Program } from '../../../core/data/database/entities/program.entity';
import { GlobalEntities } from '../../../core/data/types';

describe('ProgramService', () => {
  let service: ProgramService;
  let repository: ProgramRepository;
  let module: TestingModule;

  const mockProgramRepository = {
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

  const mockProgram: Partial<Program> = {
    id: 1,
    program_name: 'Test Program',
    abbreviation: 'TP',
    description: 'Test program description',
    curriculum_url: 'https://example.com/curriculum',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProgramService,
        {
          provide: ProgramRepository,
          useValue: mockProgramRepository,
        },
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
    repository = module.get<ProgramRepository>(ProgramRepository);
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

    it('should be an instance of ProgramService', () => {
      expect(service).toBeInstanceOf(ProgramService);
    });

    it('should have repository dependency injected', () => {
      expect(service['programRepository']).toBeDefined();
      expect(service['programRepository']).toBe(repository);
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
    it('should return all programs', async () => {
      const mockPrograms = [mockProgram, mockProgram];
      mockProgramRepository.getAll.mockResolvedValue(mockPrograms);

      const result = await service.getAll();

      expect(result).toEqual(mockPrograms);
      expect(mockProgramRepository.getAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockProgramRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(mockProgramRepository.getAll).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockProgramRepository.getAll.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow('Database error');
      expect(mockProgramRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one program by criteria', async () => {
      const whereCriteria = { id: 1 };
      const relations: GlobalEntities[] = ['cycleProgram'];
      const selects = { id: true, program_name: true, abbreviation: true };

      mockProgramRepository.findOne.mockResolvedValue(mockProgram);

      const result = await service.findOne(whereCriteria, relations, selects);

      expect(result).toEqual(mockProgram);
      expect(mockProgramRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          relations,
          select: selects,
        })
      );
    });

    it('should return null when no program found', async () => {
      const whereCriteria = { id: 999 };
      mockProgramRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(whereCriteria);

      expect(result).toBeNull();
      expect(mockProgramRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('should find multiple programs', async () => {
      const whereCriteria = { program_name: 'Test Program' };
      const mockPrograms = [mockProgram, mockProgram];

      mockProgramRepository.findMany.mockResolvedValue(mockPrograms);

      const result = await service.findMany(whereCriteria);

      expect(result).toEqual(mockPrograms);
      expect(mockProgramRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
        })
      );
    });
  });

  describe('findAndCount', () => {
    it('should find programs with count and pagination', async () => {
      const whereCriteria = { abbreviation: 'TP' };
      const mockPrograms = [mockProgram];
      const mockResult: [Partial<Program>[], number] = [mockPrograms, 1];

      mockProgramRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await service.findAndCount(whereCriteria, [], { id: true, program_name: true }, 0, 10);

      expect(result).toEqual(mockResult);
      expect(mockProgramRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          skip: 0,
          take: 10,
        })
      );
    });
  });

  describe('create', () => {
    it('should create a new program', () => {
      const createData = {
        program_name: 'New Program',
        abbreviation: 'NP',
        description: 'New program description',
      };

      mockProgramRepository.create.mockReturnValue(createData);

      const result = service.create(createData);

      expect(result).toEqual(createData);
      expect(mockProgramRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a program', async () => {
      const criteria = { id: 1 };
      const updateData = { program_name: 'Updated Program' };
      const mockUpdateResult = { affected: 1 };

      mockProgramRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockProgramRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a program', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockProgramRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockProgramRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single program', async () => {
      const saveData = mockProgram;
      mockProgramRepository.save.mockResolvedValue(saveData);

      const result = await service.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockProgramRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple programs', async () => {
      const saveData = [mockProgram, mockProgram];
      mockProgramRepository.save.mockResolvedValue(saveData);

      const result = await service.save(...saveData);

      expect(result).toEqual(saveData);
      expect(mockProgramRepository.save).toHaveBeenCalledWith(...saveData);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockProgramRepository.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockProgramRepository.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
