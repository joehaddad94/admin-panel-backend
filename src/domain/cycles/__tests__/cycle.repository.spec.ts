import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CycleRepository } from '../cycle.repository';
import { Cycles } from '../../../core/data/database/entities/cycle.entity';

describe('CycleRepository', () => {
  let repository: CycleRepository;
  let typeOrmRepository: Repository<Cycles>;
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
        CycleRepository,
        {
          provide: getRepositoryToken(Cycles),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<CycleRepository>(CycleRepository);
    typeOrmRepository = module.get<Repository<Cycles>>(getRepositoryToken(Cycles));
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
      expect(repository).toBeInstanceOf(CycleRepository);
      expect(repository).toHaveProperty('repository');
    });

    it('should have access to BaseRepository methods', () => {
      expect(typeof repository.findMany).toBe('function');
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
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
        const mockData = [{ id: 1, name: 'Cycle 1' }];
        mockTypeOrmRepository.find.mockResolvedValue(mockData);

        const result = await repository.findMany({ where: { name: 'Cycle 1' } });

        expect(mockTypeOrmRepository.find).toHaveBeenCalled();
        expect(result).toEqual(mockData);
      });

          it('should delegate findOne to TypeORM repository', async () => {
        const mockData = { id: 1, name: 'Cycle 1' };
        mockTypeOrmRepository.findOne.mockResolvedValue(mockData);

        const result = await repository.findOne({ where: { name: 'Cycle 1' } });

        expect(mockTypeOrmRepository.findOne).toHaveBeenCalled();
        expect(result).toEqual(mockData);
      });

    it('should delegate save to TypeORM repository', async () => {
      const mockData = { id: 1, name: 'Cycle 1' };
      mockTypeOrmRepository.save.mockResolvedValue(mockData);

      const result = await repository.save(mockData);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should delegate update to TypeORM repository', async () => {
      const mockResult = { affected: 1 };
      mockTypeOrmRepository.update.mockResolvedValue(mockResult);

      const result = await repository.update({ id: 1 }, { name: 'Updated Cycle' });

      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { name: 'Updated Cycle' }
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

          it('should delegate findAndCount to TypeORM repository', async () => {
        const mockData = [{ id: 1, name: 'Cycle 1' }];
        mockTypeOrmRepository.findAndCount.mockResolvedValue([mockData, 1]);

        const result = await repository.findAndCount({ where: { name: 'Cycle 1' } });

        expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalled();
        expect(result).toEqual([mockData, 1]);
      });

    it('should delegate create to TypeORM repository', () => {
      const mockData = { name: 'New Cycle' };
      const mockEntity = { id: 1, ...mockData };
      mockTypeOrmRepository.create.mockReturnValue(mockEntity);

      const result = repository.create(mockData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockEntity);
    });

    it('should delegate getQueryBuilder to TypeORM repository', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();

      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockQueryBuilder);
    });
  });

  describe('cycle-specific operations', () => {
            it('should handle cycle queries with relations', async () => {
          const mockData = [{ id: 1, name: 'Cycle 1' }];
          mockTypeOrmRepository.find.mockResolvedValue(mockData);

          const result = await repository.findMany({
            where: { cycleProgram: { program_id: 1 } },
            relations: ['cycleProgram', 'decisionDateCycle', 'thresholdCycle']
          });

          expect(mockTypeOrmRepository.find).toHaveBeenCalled();
          expect(result).toEqual(mockData);
        });

            it('should handle cycle queries with ordering', async () => {
          const mockData = [{ id: 1, name: 'Cycle 1' }];
          mockTypeOrmRepository.findOne.mockResolvedValue(mockData);

          const result = await repository.findOne({
            where: { cycleProgram: { program_id: 1 } },
            relations: ['cycleProgram'],
            order: { code: 'DESC' }
          });

          expect(mockTypeOrmRepository.findOne).toHaveBeenCalled();
          expect(result).toEqual(mockData);
        });
  });
});
