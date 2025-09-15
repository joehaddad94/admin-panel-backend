import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MicrocampApplicationRepository } from '../microcamp-applications.repository';
import { MicrocampApplication } from '../../../core/data/database/entities/microcamp-application.entity';

describe('MicrocampApplicationRepository', () => {
  let repository: MicrocampApplicationRepository;
  let typeOrmRepository: Repository<MicrocampApplication>;
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

  const mockMicrocampApplication: Partial<MicrocampApplication> = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    phone_number: 1234567890,
    country_residence: 'Test Country',
    age_range: '18-25',
    referral_source: 'Social Media',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MicrocampApplicationRepository,
        {
          provide: getRepositoryToken(MicrocampApplication),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
    typeOrmRepository = module.get<Repository<MicrocampApplication>>(getRepositoryToken(MicrocampApplication));
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

    it('should be an instance of MicrocampApplicationRepository', () => {
      expect(repository).toBeInstanceOf(MicrocampApplicationRepository);
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
    it('should return all microcamp applications', async () => {
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];
      mockTypeOrmRepository.find.mockResolvedValue(mockApplications);

      const result = await repository.getAll();

      expect(result).toEqual(mockApplications);
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
    it('should find one microcamp application with options', async () => {
      const options = {
        where: { id: 1 },
        relations: ['applicationMicrocamp'],
        select: { id: true, email: true, full_name: true },
      };

      mockTypeOrmRepository.findOne.mockResolvedValue(mockMicrocampApplication);

      const result = await repository.findOne(options);

      expect(result).toEqual(mockMicrocampApplication);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null when no application found', async () => {
      const options = { where: { id: 999 } };
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne(options);

      expect(result).toBeNull();
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('findMany', () => {
    it('should find multiple microcamp applications with options', async () => {
      const options = {
        where: { country_residence: 'Test Country' },
        order: { created_at: 'DESC' as const },
      };
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];

      mockTypeOrmRepository.find.mockResolvedValue(mockApplications);

      const result = await repository.findMany(options);

      expect(result).toEqual(mockApplications);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('findAndCount', () => {
    it('should find applications with count', async () => {
      const options = {
        where: { age_range: '18-25' },
        skip: 0,
        take: 10,
      };
      const mockApplications = [mockMicrocampApplication];
      const mockResult: [Partial<MicrocampApplication>[], number] = [mockApplications, 1];

      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await repository.findAndCount(options);

      expect(result).toEqual(mockResult);
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith(options);
    });
  });

  describe('create', () => {
    it('should create a new microcamp application', () => {
      const createData = {
        email: 'new@example.com',
        full_name: 'New User',
        phone_number: 9876543210,
      };

      mockTypeOrmRepository.create.mockReturnValue(createData);

      const result = repository.create(createData);

      expect(result).toEqual(createData);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a microcamp application', async () => {
      const criteria = { id: 1 };
      const updateData = { email: 'updated@example.com' };
      const mockUpdateResult = { affected: 1 };

      mockTypeOrmRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await repository.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a microcamp application', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockTypeOrmRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await repository.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single microcamp application', async () => {
      const saveData = mockMicrocampApplication;
      mockTypeOrmRepository.save.mockResolvedValue(saveData);

      const result = await repository.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple microcamp applications', async () => {
      const saveData = [mockMicrocampApplication, mockMicrocampApplication];
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
      expect(repository).toBeInstanceOf(MicrocampApplicationRepository);
    });

    it('should have proper constructor injection', () => {
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(typeOrmRepository);
    });
  });
});
