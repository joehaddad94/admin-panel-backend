import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InformationService } from '../information.service';
import { InformationRepository } from '../information.repository';
import { Information } from '../../../core/data/database/entities/information.entity';

describe('InformationService', () => {
  let service: InformationService;
  let repository: InformationRepository;

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
        InformationService,
        {
          provide: getRepositoryToken(Information),
          useValue: mockRepository,
        },
        {
          provide: InformationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InformationService>(InformationService);
    repository = module.get<InformationRepository>(InformationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('service instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of InformationService', () => {
      expect(service).toBeInstanceOf(InformationService);
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('inherited BaseService methods', () => {
    it('should call repository.getAll when getAll is called', async () => {
      const mockData = [{ id: 1, title: 'Test Information' }];
      mockRepository.getAll.mockResolvedValue(mockData);

      const result = await service.getAll();
      expect(result).toEqual(mockData);
      expect(mockRepository.getAll).toHaveBeenCalled();
    });

    it('should call repository.findOne when findOne is called', async () => {
      const mockData = { id: 1, title: 'Test Information' };
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
      const mockData = [{ id: 1, first_name: 'Test Information' }];
      mockRepository.findMany.mockResolvedValue(mockData);

      const result = await service.findMany({ first_name: 'Test' });
      expect(result).toEqual(mockData);
      expect(mockRepository.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { first_name: 'Test' },
        relations: undefined,
        select: null,
      }));
    });

    it('should call repository.create when create is called', async () => {
      const mockData = { first_name: 'New Information' };
      const mockEntity = { id: 1, ...mockData };
      mockRepository.create.mockReturnValue(mockEntity);

      const result = service.create(mockData);
      expect(result).toEqual(mockEntity);
      expect(mockRepository.create).toHaveBeenCalledWith(mockData);
    });

    it('should call repository.save when save is called', async () => {
      const mockEntity = { id: 1, title: 'Test Information' };
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.save(mockEntity);
      expect(result).toEqual(mockEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should call repository.update when update is called', async () => {
      const mockData = { first_name: 'Updated Information' };
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
      const mockData = [[{ id: 1, first_name: 'Test Information' }], 1];
      mockRepository.findAndCount.mockResolvedValue(mockData);

      const result = await service.findAndCount({ first_name: 'Test' });
      expect(result).toEqual(mockData);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { first_name: 'Test' },
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

  describe('service methods availability', () => {
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

  describe('BaseService parameter wrapping', () => {
    it('should wrap findOne parameters correctly', async () => {
      const mockData = { id: 1, title: 'Test Information' };
      mockRepository.findOne.mockResolvedValue(mockData);

      await service.findOne({ id: 1 });

      expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
        relations: undefined,
        select: null,
      }));
    });

    it('should wrap findMany parameters correctly', async () => {
      const mockData = [{ id: 1, title: 'Test Information' }];
      mockRepository.findMany.mockResolvedValue(mockData);

      await service.findMany({ first_name: 'Test' });

      expect(mockRepository.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { first_name: 'Test' },
        relations: undefined,
        select: null,
      }));
    });

    it('should wrap findAndCount parameters correctly', async () => {
      const mockData = [[{ id: 1, title: 'Test Information' }], 1];
      mockRepository.findAndCount.mockResolvedValue(mockData);

      await service.findAndCount({ first_name: 'Test' });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { first_name: 'Test' },
        select: null,
      }));
    });
  });
});
