import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformationRepository } from '../information.repository';
import { Information } from '../../../core/data/database/entities/information.entity';

describe('InformationRepository', () => {
  let repository: InformationRepository;
  let typeOrmRepository: Repository<Information>;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationRepository,
        {
          provide: getRepositoryToken(Information),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<InformationRepository>(InformationRepository);
    typeOrmRepository = module.get<Repository<Information>>(getRepositoryToken(Information));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('repository instantiation', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should be an instance of InformationRepository', () => {
      expect(repository).toBeInstanceOf(InformationRepository);
    });

    it('should have TypeORM repository injected', () => {
      expect(typeOrmRepository).toBeDefined();
      expect(typeOrmRepository).toBe(mockTypeOrmRepository);
    });
  });

  describe('inherited BaseRepository methods', () => {
    it('should call TypeORM repository.find when getAll is called', async () => {
      const mockData = [{ id: 1, title: 'Test Information' }];
      mockTypeOrmRepository.find.mockResolvedValue(mockData);

      const result = await repository.getAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should call TypeORM repository.findOne when findOne is called', async () => {
      const mockData = { id: 1, title: 'Test Information' };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockData);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockData);
    });

    it('should call TypeORM repository.find when findMany is called', async () => {
      const mockData = [{ id: 1, first_name: 'Test Information' }];
      mockTypeOrmRepository.find.mockResolvedValue(mockData);

      const result = await repository.findMany({ where: { first_name: 'Test' } });

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({ where: { first_name: 'Test' } });
      expect(result).toEqual(mockData);
    });

    it('should call TypeORM repository.create when create is called', async () => {
      const mockData = { first_name: 'New Information' };
      const mockEntity = { id: 1, ...mockData };
      mockTypeOrmRepository.create.mockReturnValue(mockEntity);

      const result = repository.create(mockData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockEntity);
    });

    it('should call TypeORM repository.save when save is called', async () => {
      const mockEntity = { id: 1, first_name: 'Test Information' };
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      const result = await repository.save(mockEntity);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });

    it('should call TypeORM repository.update when update is called', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.update.mockResolvedValue(mockResult);

      const result = await repository.update({ id: 1 }, { first_name: 'Updated Information' });

      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { first_name: 'Updated Information' }
      );
      expect(result).toEqual(mockResult);
    });

    it('should call TypeORM repository.delete when delete is called', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.delete.mockResolvedValue(mockResult);

      const result = await repository.delete({ id: 1 });

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockResult);
    });

    it('should call TypeORM repository.findAndCount when findAndCount is called', async () => {
      const mockData = [[{ id: 1, first_name: 'Test Information' }], 1];
      mockTypeOrmRepository.findAndCount.mockResolvedValue(mockData);

      const result = await repository.findAndCount({ where: { first_name: 'Test' } });

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({ where: { first_name: 'Test' } });
      expect(result).toEqual(mockData);
    });

    it('should call TypeORM repository.createQueryBuilder when getQueryBuilder is called', () => {
      const mockQueryBuilder = { where: jest.fn() };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();

      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockQueryBuilder);
    });
  });

  describe('repository methods availability', () => {
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
  });

  describe('entity-specific operations', () => {
    it('should handle information entity fields correctly', async () => {
      const mockInformation = {
        id: 1,
        first_name: 'Test Information',
        last_name: 'Test Last Name',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockInformation);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockInformation);
      expect(result.first_name).toBe('Test Information');
      expect(result.last_name).toBe('Test Last Name');
      expect(result.email).toBe('test@example.com');
    });

    it('should handle empty results correctly', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.findMany({ where: { first_name: 'NonExistent' } });

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle null results correctly', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
    });
  });
});
