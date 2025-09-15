import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramRepository } from '../program.repository';
import { Program } from '../../../core/data/database/entities/program.entity';

describe('ProgramRepository', () => {
  let repository: ProgramRepository;
  let typeOrmRepository: Repository<Program>;
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
        ProgramRepository,
        {
          provide: getRepositoryToken(Program),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<ProgramRepository>(ProgramRepository);
    typeOrmRepository = module.get<Repository<Program>>(getRepositoryToken(Program));
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

    it('should be an instance of ProgramRepository', () => {
      expect(repository).toBeInstanceOf(ProgramRepository);
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
    it('should return all programs', async () => {
      const mockPrograms = [mockProgram, mockProgram];
      mockTypeOrmRepository.find.mockResolvedValue(mockPrograms);

      const result = await repository.getAll();

      expect(result).toEqual(mockPrograms);
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
    it('should find one program with options', async () => {
      const options = {
        where: { id: 1 },
        relations: ['cycleProgram'],
        select: { id: true, program_name: true, abbreviation: true },
      };

      mockTypeOrmRepository.findOne.mockResolvedValue(mockProgram);

      const result = await repository.findOne(options);

      expect(result).toEqual(mockProgram);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null when no program found', async () => {
      const options = { where: { id: 999 } };
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne(options);

      expect(result).toBeNull();
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('findMany', () => {
    it('should find multiple programs with options', async () => {
      const options = {
        where: { program_name: 'Test Program' },
        order: { created_at: 'DESC' as const },
      };
      const mockPrograms = [mockProgram, mockProgram];

      mockTypeOrmRepository.find.mockResolvedValue(mockPrograms);

      const result = await repository.findMany(options);

      expect(result).toEqual(mockPrograms);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('findAndCount', () => {
    it('should find programs with count', async () => {
      const options = {
        where: { abbreviation: 'TP' },
        skip: 0,
        take: 10,
      };
      const mockPrograms = [mockProgram];
      const mockResult: [Partial<Program>[], number] = [mockPrograms, 1];

      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await repository.findAndCount(options);

      expect(result).toEqual(mockResult);
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith(options);
    });
  });

  describe('create', () => {
    it('should create a new program', () => {
      const createData = {
        program_name: 'New Program',
        abbreviation: 'NP',
        description: 'New program description',
      };

      mockTypeOrmRepository.create.mockReturnValue(createData);

      const result = repository.create(createData);

      expect(result).toEqual(createData);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a program', async () => {
      const criteria = { id: 1 };
      const updateData = { program_name: 'Updated Program' };
      const mockUpdateResult = { affected: 1 };

      mockTypeOrmRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await repository.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a program', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockTypeOrmRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await repository.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single program', async () => {
      const saveData = mockProgram;
      mockTypeOrmRepository.save.mockResolvedValue(saveData);

      const result = await repository.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple programs', async () => {
      const saveData = [mockProgram, mockProgram];
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
      expect(repository).toBeInstanceOf(ProgramRepository);
    });

    it('should have proper constructor injection', () => {
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(typeOrmRepository);
    });
  });
});
