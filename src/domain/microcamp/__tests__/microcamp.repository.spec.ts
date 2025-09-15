import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MicrocampRepository } from '../microcamp.repository';
import { Microcamp } from '../../../core/data/database/entities/microcamp.entity';

// Mock the BaseRepository methods
jest.mock('../../../core/settings/base/repository/base.repository', () => ({
  BaseRepository: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    getQueryBuilder: jest.fn(),
  })),
}));

describe('MicrocampRepository', () => {
  let repository: MicrocampRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Microcamp>>;

  const mockMicrocamp: Microcamp = {
    id: 1,
    code: 'MC001',
    name: 'Test Microcamp',
    created_at: new Date(),
    updated_at: new Date(),
  } as Microcamp;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicrocampRepository,
        {
          provide: getRepositoryToken(Microcamp),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MicrocampRepository>(MicrocampRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Microcamp));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all microcamps', async () => {
      const mockMicrocamps = [mockMicrocamp];
      jest.spyOn(repository, 'getAll').mockResolvedValue(mockMicrocamps);

      const result = await repository.getAll();

      expect(result).toEqual(mockMicrocamps);
      expect(repository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a microcamp by criteria', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockMicrocamp);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockMicrocamp);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when microcamp not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('findMany', () => {
    it('should find multiple microcamps by criteria', async () => {
      const mockMicrocamps = [mockMicrocamp];
      jest.spyOn(repository, 'findMany').mockResolvedValue(mockMicrocamps);

      const result = await repository.findMany({ where: { code: 'MC001' } });

      expect(result).toEqual(mockMicrocamps);
      expect(repository.findMany).toHaveBeenCalledWith({ where: { code: 'MC001' } });
    });
  });

  describe('findAndCount', () => {
    it('should find microcamps with count', async () => {
      const mockMicrocamps = [mockMicrocamp];
      const mockCount = 1;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockMicrocamps, mockCount]);

      const result = await repository.findAndCount({ where: { code: 'MC001' } });

      expect(result).toEqual([mockMicrocamps, mockCount]);
      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { code: 'MC001' } });
    });
  });

  describe('create', () => {
    it('should create a new microcamp', () => {
      const newMicrocamp = { code: 'MC002', name: 'New Microcamp' };
      jest.spyOn(repository, 'create').mockReturnValue(mockMicrocamp);

      const result = repository.create(newMicrocamp as any);

      expect(result).toEqual(mockMicrocamp);
      expect(repository.create).toHaveBeenCalledWith(newMicrocamp);
    });
  });

  describe('update', () => {
    it('should update a microcamp', async () => {
      const updateData = { name: 'Updated Microcamp' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a microcamp', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a microcamp', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockMicrocamp);

      const result = await repository.save(mockMicrocamp as any);

      expect(result).toEqual(mockMicrocamp);
      expect(repository.save).toHaveBeenCalledWith(mockMicrocamp);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = {} as any;
      jest.spyOn(repository, 'getQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(repository.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
