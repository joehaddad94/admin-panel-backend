import { Test, TestingModule } from '@nestjs/testing';
import { ThresholdService } from '../threshold.service';
import { ThresholdRepository } from '../threshold.repository';
import { Threshold } from '../../../core/data/database/entities/threshold.entity';
import { GlobalEntities } from '../../../core/data/types';

describe('ThresholdService', () => {
  let service: ThresholdService;
  let repository: ThresholdRepository;
  let module: TestingModule;

  const mockThresholdRepository = {
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

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ThresholdService,
        {
          provide: ThresholdRepository,
          useValue: mockThresholdRepository,
        },
      ],
    }).compile();

    service = module.get<ThresholdService>(ThresholdService);
    repository = module.get<ThresholdRepository>(ThresholdRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('service instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of ThresholdService', () => {
      expect(service).toBeInstanceOf(ThresholdService);
    });

    it('should have repository dependency injected', () => {
      expect(repository).toBeDefined();
    });

    it('should have all required methods from BaseService', () => {
      expect(service.getAll).toBeDefined();
      expect(service.findOne).toBeDefined();
      expect(service.findMany).toBeDefined();
      expect(service.findAndCount).toBeDefined();
      expect(service.create).toBeDefined();
      expect(service.update).toBeDefined();
      expect(service.delete).toBeDefined();
      expect(service.save).toBeDefined();
      expect(service.getQueryBuilder).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return all thresholds', async () => {
      const mockThresholds = [
        { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 },
        { id: 2, exam_passing_grade: 75, weight_soft: 0.4, weight_tech: 0.6 },
      ];

      mockThresholdRepository.getAll.mockResolvedValue(mockThresholds);

      const result = await service.getAll();

      expect(repository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockThresholds);
    });

    it('should handle empty results', async () => {
      mockThresholdRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(repository.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      mockThresholdRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow('Database error');
      expect(repository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one threshold by criteria', async () => {
      const mockThreshold = { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 };
      const criteria = { id: 1 };

      mockThresholdRepository.findOne.mockResolvedValue(mockThreshold);

      const result = await service.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: criteria }));
      expect(result).toEqual(mockThreshold);
    });

    it('should return null when no threshold found', async () => {
      const criteria = { id: 999 };

      mockThresholdRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: criteria }));
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple thresholds', async () => {
      const mockThresholds = [
        { id: 1, exam_passing_grade: 70 },
        { id: 2, exam_passing_grade: 75 },
      ];
      const criteria = { exam_passing_grade: 70 };

      mockThresholdRepository.findMany.mockResolvedValue(mockThresholds);

      const result = await service.findMany(criteria);

      expect(repository.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: criteria }));
      expect(result).toEqual(mockThresholds);
    });
  });

  describe('findAndCount', () => {
    it('should find thresholds with count and pagination', async () => {
      const mockResult = [[{ id: 1 }, { id: 2 }], 2];
      const criteria = { exam_passing_grade: 70 };
      const options = { skip: 0, take: 10 };

      mockThresholdRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await service.findAndCount(criteria, undefined, undefined, options.skip, options.take);

      expect(repository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({ where: criteria, skip: options.skip, take: options.take }));
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

      mockThresholdRepository.create.mockReturnValue(createData);

      const result = await service.create(createData);

      expect(repository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(createData);
    });
  });

  describe('update', () => {
    it('should update a threshold', async () => {
      const criteria = { id: 1 };
      const updateData = { exam_passing_grade: 75 };

      mockThresholdRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(criteria, updateData);

      expect(repository.update).toHaveBeenCalledWith(criteria, updateData);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a threshold', async () => {
      const criteria = { id: 1 };

      mockThresholdRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(criteria);

      expect(repository.delete).toHaveBeenCalledWith(criteria);
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

      mockThresholdRepository.save.mockResolvedValue(thresholdData);

      const result = await service.save(thresholdData);

      expect(repository.save).toHaveBeenCalledWith(thresholdData);
      expect(result).toEqual(thresholdData);
    });

    it('should save multiple thresholds', async () => {
      const thresholdsData = [
        { id: 1, exam_passing_grade: 70, weight_soft: 0.3, weight_tech: 0.7 },
        { id: 2, exam_passing_grade: 75, weight_soft: 0.4, weight_tech: 0.6 },
      ];

      mockThresholdRepository.save.mockResolvedValue(thresholdsData);

      const result = await service.save(...thresholdsData);

      expect(repository.save).toHaveBeenCalledWith(...thresholdsData);
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

      mockThresholdRepository.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getQueryBuilder();

      expect(repository.getQueryBuilder).toHaveBeenCalled();
      expect(result).toBe(mockQueryBuilder);
    });
  });
});
