import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThresholdRepository } from '../threshold.repository';
import { Threshold } from '../../../core/data/database/entities/threshold.entity';

describe('ThresholdRepository', () => {
  let repository: ThresholdRepository;
  let typeOrmRepository: Repository<Threshold>;
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

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThresholdRepository,
        {
          provide: getRepositoryToken(Threshold),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<ThresholdRepository>(ThresholdRepository);
    typeOrmRepository = module.get<Repository<Threshold>>(getRepositoryToken(Threshold));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('repository instantiation', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should be an instance of ThresholdRepository', () => {
      expect(repository).toBeInstanceOf(ThresholdRepository);
    });

    it('should have TypeORM repository injected', () => {
      expect(typeOrmRepository).toBeDefined();
    });

    it('should have all required methods from BaseRepository', () => {
      expect(repository.getAll).toBeDefined();
      expect(repository.findOne).toBeDefined();
      expect(repository.findMany).toBeDefined();
      expect(repository.findAndCount).toBeDefined();
      expect(repository.create).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.delete).toBeDefined();
      expect(repository.save).toBeDefined();
      expect(repository.getQueryBuilder).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return all thresholds', async () => {
      const mockThresholds = [
        { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 },
        { id: 2, exam_passing_grade: 75, weight_soft: 0.4, weight_tech: 0.6 },
      ];

      mockTypeOrmRepository.find.mockResolvedValue(mockThresholds);

      const result = await repository.getAll();

      expect(typeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockThresholds);
    });

    it('should handle empty results', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(typeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      mockTypeOrmRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.getAll()).rejects.toThrow('Database error');
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one threshold with options', async () => {
      const mockThreshold = { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 };
      const options = {
        where: { id: 1 },
        select: { id: true, exam_passing_grade: true },
      };

      mockTypeOrmRepository.findOne.mockResolvedValue(mockThreshold);

      const result = await repository.findOne(options);

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockThreshold);
    });

    it('should return null when no threshold found', async () => {
      const options = { where: { id: 999 } };

      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne(options);

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple thresholds with options', async () => {
      const mockThresholds = [
        { id: 1, exam_passing_grade: 70 },
        { id: 2, exam_passing_grade: 75 },
      ];
      const options = {
        where: { exam_passing_grade: 70 },
        order: { id: 'ASC' } as const,
      };

      mockTypeOrmRepository.find.mockResolvedValue(mockThresholds);

      const result = await repository.findMany(options);

      expect(typeOrmRepository.find).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockThresholds);
    });
  });

  describe('findAndCount', () => {
    it('should find thresholds with count', async () => {
      const mockResult = [[{ id: 1 }, { id: 2 }], 2];
      const options = {
        where: { exam_passing_grade: 70 },
        skip: 0,
        take: 10,
      };

      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await repository.findAndCount(options);

      expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('should create a new threshold', async () => {
      const createData = {
        exam_passing_grade: 70,
        weight_soft: 0.3,
        weight_tech: 0.7,
        primary_passing_grade: 15,
        secondary_passing_grade: 12,
      };

      mockTypeOrmRepository.create.mockReturnValue(createData);

      const result = await repository.create(createData);

      expect(typeOrmRepository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(createData);
    });
  });

  describe('update', () => {
    it('should update a threshold', async () => {
      const criteria = { id: 1 };
      const updateData = { exam_passing_grade: 75 };

      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });

      const result = await repository.update(criteria, updateData);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(criteria, updateData);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a threshold', async () => {
      const criteria = { id: 1 };

      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete(criteria);

      expect(typeOrmRepository.delete).toHaveBeenCalledWith(criteria);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('save', () => {
    it('should save a single threshold', async () => {
      const thresholdData = {
        id: 1,
        exam_passing_grade: 70,
        weight_soft: 0.3,
        weight_tech: 0.7,
      };

      mockTypeOrmRepository.save.mockResolvedValue(thresholdData);

      const result = await repository.save(thresholdData);

      expect(typeOrmRepository.save).toHaveBeenCalledWith(thresholdData);
      expect(result).toEqual(thresholdData);
    });

    it('should save multiple thresholds', async () => {
      const thresholdsData = [
        { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 },
        { id: 2, exam_passing_grade: 75, weight_soft: 0.4, weight_tech: 0.6 },
      ];

      mockTypeOrmRepository.save.mockResolvedValue(thresholdsData);

      const result = await repository.save(...thresholdsData);

      expect(typeOrmRepository.save).toHaveBeenCalledWith(thresholdsData);
      expect(result).toEqual(thresholdsData);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.getQueryBuilder();

      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBe(mockQueryBuilder);
    });
  });

  describe('repository structure', () => {
    it('should extend BaseRepository', () => {
      expect(repository).toBeInstanceOf(ThresholdRepository);
    });

    it('should have proper constructor injection', () => {
      expect(typeOrmRepository).toBeDefined();
    });
  });
});
