import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DecisionDateRepository } from '../decision-date.repository';
import { DecisionDates } from '../../../core/data/database/entities/decision-date.entity';

describe('DecisionDateRepository', () => {
  let repository: DecisionDateRepository;
  let mockTypeOrmRepository: any;

  const mockEntity = {
    id: 1,
    date_time_1: new Date('2024-01-01T10:00:00Z'),
    link_1: 'https://example.com/link1',
    link_2: 'https://example.com/link2',
    link_3: 'https://example.com/link3',
    link_4: 'https://example.com/link4',
    date_1: new Date('2024-01-01'),
    date_2: new Date('2024-01-02'),
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    mockTypeOrmRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
        getCount: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionDateRepository,
        {
          provide: getRepositoryToken(DecisionDates),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<DecisionDateRepository>(DecisionDateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inherited BaseRepository methods', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should be an instance of DecisionDateRepository', () => {
      expect(repository).toBeInstanceOf(DecisionDateRepository);
    });

    it('should call TypeORM repository.find when getAll is called', async () => {
      const mockData = [mockEntity];
      mockTypeOrmRepository.find.mockResolvedValue(mockData);

      const result = await repository.getAll();
      expect(result).toEqual(mockData);
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });

    it('should call TypeORM repository.findOne when findOne is called', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findOne({ where: { id: 1 } });
      expect(result).toEqual(mockEntity);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should call TypeORM repository.find when findMany is called', async () => {
      const mockData = [mockEntity];
      mockTypeOrmRepository.find.mockResolvedValue(mockData);

      const result = await repository.findMany({ where: { link_1: 'https://example.com/link1' } });
      expect(result).toEqual(mockData);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({ where: { link_1: 'https://example.com/link1' } });
    });

    it('should call TypeORM repository.create when create is called', async () => {
      const createData = {
        date_time_1: new Date('2024-01-01T10:00:00Z'),
        link_1: 'https://example.com/link1',
        cycleId: 1,
      };

      mockTypeOrmRepository.create.mockReturnValue(mockEntity);

      const result = repository.create(createData);
      expect(result).toEqual(mockEntity);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });

    it('should call TypeORM repository.save when save is called', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      const result = await repository.save(mockEntity);
      expect(result).toEqual(mockEntity);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should call TypeORM repository.update when update is called', async () => {
      const updateData = { link_1: 'https://updated.com/link1' };
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });

      const result = await repository.update({ id: 1 }, updateData);
      expect(result).toEqual({ affected: 1 });
      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });

    it('should call TypeORM repository.delete when delete is called', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete({ id: 1 });
      expect(result).toEqual({ affected: 1 });
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should call TypeORM repository.findAndCount when findAndCount is called', async () => {
      const mockData = [[mockEntity], 1];
      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockData);

      const result = await repository.findAndCount({ where: { link_1: 'https://example.com/link1' } });
      expect(result).toEqual(mockData);
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({ where: { link_1: 'https://example.com/link1' } });
    });

    it('should call TypeORM repository.createQueryBuilder when getQueryBuilder is called', () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
        getCount: jest.fn(),
      };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();
      expect(result).toEqual(mockQueryBuilder);
      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('repository instantiation', () => {
    it('should have all required methods', () => {
      expect(typeof repository.getAll).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
      expect(typeof repository.getQueryBuilder).toBe('function');
    });

    it('should have TypeORM repository injected', () => {
      expect(mockTypeOrmRepository).toBeDefined();
    });
  });

  describe('entity-specific operations', () => {
    it('should handle date fields correctly', async () => {
      const createData = {
        date_time_1: new Date('2024-01-01T10:00:00Z'),
        date_1: new Date('2024-01-01'),
        date_2: new Date('2024-01-02'),
        cycleId: 1,
      };

      mockTypeOrmRepository.create.mockReturnValue(mockEntity);

      const result = repository.create(createData);
      expect(result).toEqual(mockEntity);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });

    it('should handle link fields correctly', async () => {
      const createData = {
        link_1: 'https://example.com/link1',
        link_2: 'https://example.com/link2',
        link_3: 'https://example.com/link3',
        link_4: 'https://example.com/link4',
        cycleId: 1,
      };

      mockTypeOrmRepository.create.mockReturnValue(mockEntity);

      const result = repository.create(createData);
      expect(result).toEqual(mockEntity);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(createData);
    });
  });
});
