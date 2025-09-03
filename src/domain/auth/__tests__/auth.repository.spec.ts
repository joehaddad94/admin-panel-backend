import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../auth.repository';
import { Admin } from '../../../core/data/database';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let typeOrmRepository: Repository<Admin>;
  let module: TestingModule;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    typeOrmRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
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
      expect(repository).toBeInstanceOf(AuthRepository);
      expect(repository).toHaveProperty('repository');
    });

    it('should have access to BaseRepository methods', () => {
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.save).toBe('function');
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
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(typeOrmRepository);
    });
  });

  describe('BaseRepository functionality', () => {
    it('should delegate findMany to TypeORM repository', async () => {
      const mockData = [{ id: 1, email: 'test@example.com' }];
      mockTypeOrmRepository.find.mockResolvedValue(mockData);

      const result = await repository.findMany({ where: { email: 'test@example.com' } });

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should delegate findOne to TypeORM repository', async () => {
      const mockData = { id: 1, email: 'test@example.com' };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockData);

      const result = await repository.findOne({ where: { email: 'test@example.com' } });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should delegate save to TypeORM repository', async () => {
      const mockData = { id: 1, email: 'test@example.com' };
      mockTypeOrmRepository.save.mockResolvedValue(mockData);

      const result = await repository.save(mockData);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should delegate update to TypeORM repository', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.update.mockResolvedValue(mockResult);

      const result = await repository.update({ id: 1 }, { email: 'new@example.com' });

      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { email: 'new@example.com' }
      );
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
