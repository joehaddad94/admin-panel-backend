import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DecisionDateService } from '../decision-date.service';
import { DecisionDateRepository } from '../decision-date.repository';
import { DecisionDates } from '../../../core/data/database/entities/decision-date.entity';

describe('DecisionDateService', () => {
  let service: DecisionDateService;
  let repository: DecisionDateRepository;

  const mockRepository = {
    getAll: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    getQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionDateService,
        {
          provide: getRepositoryToken(DecisionDates),
          useValue: mockRepository,
        },
        {
          provide: DecisionDateRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DecisionDateService>(DecisionDateService);
    repository = module.get<DecisionDateRepository>(DecisionDateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inherited BaseService methods', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });

    it('should call repository.getAll when getAll is called', async () => {
      const mockData = [{ id: 1, date_time_1: new Date() }];
      mockRepository.getAll.mockResolvedValue(mockData);

      const result = await service.getAll();
      expect(result).toEqual(mockData);
      expect(mockRepository.getAll).toHaveBeenCalled();
    });

    it('should call repository.findOne when findOne is called', async () => {
      const mockData = { id: 1, date_time_1: new Date() };
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await service.findOne({ id: 1 });
      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
        relations: undefined,
        select: null,
      }));
    });

    it('should call repository.findMany when findMany is called', async () => {
      const mockData = [{ id: 1, date_time_1: new Date() }];
      mockRepository.findMany.mockResolvedValue(mockData);

      const result = await service.findMany({ link_1: 'https://example.com' });
      expect(result).toEqual(mockData);
      expect(mockRepository.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { link_1: 'https://example.com' },
        relations: undefined,
        select: null,
      }));
    });

    it('should call repository.create when create is called', async () => {
      const mockData = { link_1: 'https://example.com', cycleId: 1 };
      const mockEntity = { id: 1, ...mockData };
      mockRepository.create.mockReturnValue(mockEntity);

      const result = service.create(mockData);
      expect(result).toEqual(mockEntity);
      expect(mockRepository.create).toHaveBeenCalledWith(mockData);
    });

    it('should call repository.save when save is called', async () => {
      const mockEntity = { id: 1, link_1: 'https://example.com' };
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.save(mockEntity);
      expect(result).toEqual(mockEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should call repository.update when update is called', async () => {
      const mockData = { link_1: 'https://updated.com' };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update({ id: 1 }, mockData);
      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, mockData);
    });

    it('should call repository.delete when delete is called', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete({ id: 1 });
      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should call repository.findAndCount when findAndCount is called', async () => {
      const mockData = [[{ id: 1, link_1: 'https://example.com' }], 1];
      mockRepository.findAndCount.mockResolvedValue(mockData);

      const result = await service.findAndCount({ link_1: 'https://example.com' });
      expect(result).toEqual(mockData);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { link_1: 'https://example.com' },
        relations: undefined,
        select: null,
      }));
    });

    it('should call repository.getQueryBuilder when getQueryBuilder is called', () => {
      const mockQueryBuilder = { where: jest.fn() };
      mockRepository.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();
      expect(result).toEqual(mockQueryBuilder);
      expect(mockRepository.getQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('service instantiation', () => {
    it('should be an instance of DecisionDateService', () => {
      expect(service).toBeInstanceOf(DecisionDateService);
    });

    it('should have all required methods', () => {
      expect(typeof service.getAll).toBe('function');
      expect(typeof service.findOne).toBe('function');
      expect(typeof service.findMany).toBe('function');
      expect(typeof service.create).toBe('function');
      expect(typeof service.save).toBe('function');
      expect(typeof service.update).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.findAndCount).toBe('function');
      expect(typeof service.getQueryBuilder).toBe('function');
    });
  });
});
