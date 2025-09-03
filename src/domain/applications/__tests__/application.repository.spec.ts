import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationRepository } from '../application.repository';
import { Application } from '../../../core/data/database/entities/application.entity';

describe('ApplicationRepository', () => {
  let repository: ApplicationRepository;
  let typeOrmRepository: Repository<Application>;
  let module: TestingModule;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ApplicationRepository,
        {
          provide: getRepositoryToken(Application),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<ApplicationRepository>(ApplicationRepository);
    typeOrmRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
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

  describe('inheritance from BaseRepository', () => {
    it('should extend BaseRepository', () => {
      expect(repository).toBeInstanceOf(ApplicationRepository);
    });

    it('should have access to BaseRepository methods', () => {
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
    });

    it('should use the correct TypeORM repository', () => {
      expect(repository['repository']).toBe(typeOrmRepository);
    });
  });

  describe('constructor', () => {
    it('should properly inject the TypeORM repository', () => {
      expect(typeOrmRepository).toBeDefined();
      expect(typeOrmRepository).toBe(mockTypeOrmRepository);
    });
  });

  describe('BaseRepository functionality', () => {
    it('should delegate findMany to TypeORM repository', async () => {
      const mockResult = [{ id: 1, status: 'pending' }];
      mockTypeOrmRepository.find.mockResolvedValue(mockResult);

      const result = await repository.findMany({ where: { status: 'pending' } });

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({ where: { status: 'pending' } });
      expect(result).toEqual(mockResult);
    });

    it('should delegate findOne to TypeORM repository', async () => {
      const mockResult = { id: 1, status: 'pending' };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockResult);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockResult);
    });

    it('should delegate save to TypeORM repository', async () => {
      const mockEntity = { id: 1, status: 'approved' };
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      const result = await repository.save(mockEntity);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });

    it('should delegate update to TypeORM repository', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.update.mockResolvedValue(mockResult);

      const result = await repository.update({ id: 1 }, { status: 'approved' });

      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith({ id: 1 }, { status: 'approved' });
      expect(result).toEqual(mockResult);
    });

    it('should delegate delete to TypeORM repository', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.delete.mockResolvedValue(mockResult);

      const result = await repository.delete({ id: 1 });

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockResult);
    });
  });
});
