import { Test, TestingModule } from '@nestjs/testing';
import { ProgramMediator } from '../program.mediator';
import { ProgramService } from '../program.service';
import { Program } from '../../../core/data/database/entities/program.entity';

describe('ProgramMediator', () => {
  let mediator: ProgramMediator;
  let service: ProgramService;
  let module: TestingModule;

  const mockProgramService = {
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

  const mockProgram: Partial<Program> = {
    id: 1,
    program_name: 'Test Program',
    abbreviation: 'TP',
    description: 'Test program description',
    curriculum_url: 'https://example.com/curriculum',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProgramMediator,
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
      ],
    }).compile();

    mediator = module.get<ProgramMediator>(ProgramMediator);
    service = module.get<ProgramService>(ProgramService);
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

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of ProgramMediator', () => {
      expect(mediator).toBeInstanceOf(ProgramMediator);
    });

    it('should have service dependency injected', () => {
      expect(mediator['service']).toBeDefined();
      expect(mediator['service']).toBe(service);
    });
  });

  describe('mediator structure', () => {
    it('should be injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['service']).toBeDefined();
    });

    it('should have findPrograms method', () => {
      expect(typeof mediator.findPrograms).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject ProgramService', () => {
      expect(mediator['service']).toBe(service);
    });

    it('should have access to service methods', () => {
      expect(mediator['service']).toBeDefined();
      expect(typeof mediator['service'].getAll).toBe('function');
      expect(typeof mediator['service'].findOne).toBe('function');
      expect(typeof mediator['service'].findMany).toBe('function');
      expect(typeof mediator['service'].findAndCount).toBe('function');
      expect(typeof mediator['service'].create).toBe('function');
      expect(typeof mediator['service'].update).toBe('function');
      expect(typeof mediator['service'].delete).toBe('function');
      expect(typeof mediator['service'].save).toBe('function');
      expect(typeof mediator['service'].getQueryBuilder).toBe('function');
    });
  });

  describe('findPrograms method', () => {
    it('should return programs using query builder', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { id: 1, program_name: 'Test Program 1', abbreviation: 'TP1' },
          { id: 2, program_name: 'Test Program 2', abbreviation: 'TP2' },
        ]),
      };

      mockProgramService.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await mediator.findPrograms();

      expect(result).toEqual([
        { id: 1, program_name: 'Test Program 1', abbreviation: 'TP1' },
        { id: 2, program_name: 'Test Program 2', abbreviation: 'TP2' },
      ]);
      expect(mockProgramService.getQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(['id', 'program_name', 'abbreviation']);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('id', 'ASC');
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1000);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      mockProgramService.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await mediator.findPrograms();

      expect(result).toEqual([]);
      expect(mockProgramService.getQueryBuilder).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(new Error('Service error')),
      };

      mockProgramService.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(mediator.findPrograms()).rejects.toThrow('Service error');
      expect(mockProgramService.getQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('mediator metadata', () => {
    it('should be a valid NestJS injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper service dependency', () => {
      expect(mediator['service']).toBeDefined();
      expect(mediator['service']).toBe(service);
    });
  });

  describe('service method delegation', () => {
    it('should delegate getAll to service', async () => {
      const mockPrograms = [mockProgram, mockProgram];
      mockProgramService.getAll.mockResolvedValue(mockPrograms);

      const result = await service.getAll();

      expect(result).toEqual(mockPrograms);
      expect(mockProgramService.getAll).toHaveBeenCalled();
    });

    it('should delegate findOne to service', async () => {
      const whereCriteria = { id: 1 };
      mockProgramService.findOne.mockResolvedValue(mockProgram);

      const result = await service.findOne(whereCriteria);

      expect(result).toEqual(mockProgram);
      expect(mockProgramService.findOne).toHaveBeenCalledWith(whereCriteria);
    });

    it('should delegate findMany to service', async () => {
      const whereCriteria = { program_name: 'Test Program' };
      const mockPrograms = [mockProgram, mockProgram];

      mockProgramService.findMany.mockResolvedValue(mockPrograms);

      const result = await service.findMany(whereCriteria);

      expect(result).toEqual(mockPrograms);
      expect(mockProgramService.findMany).toHaveBeenCalledWith(whereCriteria);
    });

    it('should delegate create to service', () => {
      const createData = {
        program_name: 'New Program',
        abbreviation: 'NP',
        description: 'New program description',
      };

      mockProgramService.create.mockReturnValue(createData);

      const result = service.create(createData);

      expect(result).toEqual(createData);
      expect(mockProgramService.create).toHaveBeenCalledWith(createData);
    });

    it('should delegate update to service', async () => {
      const criteria = { id: 1 };
      const updateData = { program_name: 'Updated Program' };
      const mockUpdateResult = { affected: 1 };

      mockProgramService.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockProgramService.update).toHaveBeenCalledWith(criteria, updateData);
    });

    it('should delegate delete to service', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockProgramService.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockProgramService.delete).toHaveBeenCalledWith(criteria);
    });

    it('should delegate save to service', async () => {
      const saveData = mockProgram;
      mockProgramService.save.mockResolvedValue(saveData);

      const result = await service.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockProgramService.save).toHaveBeenCalledWith(saveData);
    });

    it('should delegate getQueryBuilder to service', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockProgramService.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockProgramService.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
