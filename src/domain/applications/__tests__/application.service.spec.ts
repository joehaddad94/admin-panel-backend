import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../application.service';
import { ApplicationRepository } from '../application.repository';
import { CycleService } from '../../cycles/cycle.service';
import { Application } from '../../../core/data/database/entities/application.entity';

// Mock the current date to be in 2024
const mockDate = new Date('2024-06-01');
jest.useFakeTimers();
jest.setSystemTime(mockDate);

describe('ApplicationService', () => {
  let service: ApplicationService;
  let applicationRepository: ApplicationRepository;
  let cycleService: CycleService;
  let module: TestingModule;

  const mockApplicationRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCycleService = {
    findMany: jest.fn(),
  };

  const mockApplication = {
    id: 1,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCycle = {
    id: 1,
    code: 'CYCLE_2024_1',
    from_date: new Date('2024-01-01'),
    to_date: new Date('2024-12-31'),
    cycleProgram: {
      program_id: 1,
    },
  };

  const mockFutureCycle = {
    id: 2,
    code: 'CYCLE_2025_1',
    from_date: new Date('2025-01-01'),
    to_date: new Date('2025-12-31'),
    cycleProgram: {
      program_id: 1,
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: ApplicationRepository,
          useValue: mockApplicationRepository,
        },
        {
          provide: CycleService,
          useValue: mockCycleService,
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    applicationRepository = module.get<ApplicationRepository>(ApplicationRepository);
    cycleService = module.get<CycleService>(CycleService);
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

  describe('getRelevantCycleId', () => {
    it('should return the first future cycle for a program', async () => {
      const cycles = [mockCycle, mockFutureCycle];
      mockCycleService.findMany.mockResolvedValue(cycles);

      const result = await service.getRelevantCycleId(1);

      expect(mockCycleService.findMany).toHaveBeenCalledWith(
        { cycleProgram: { program_id: 1 } },
        ['cycleProgram']
      );
      expect(result).toEqual(mockFutureCycle);
    });

    it('should return null when no future cycles exist', async () => {
      const pastCycles = [
        {
          id: 1,
          code: 'CYCLE_2023_1',
          from_date: new Date('2023-01-01'),
          to_date: new Date('2023-12-31'),
          cycleProgram: { program_id: 1 },
        },
      ];
      mockCycleService.findMany.mockResolvedValue(pastCycles);

      const result = await service.getRelevantCycleId(1);

      expect(result).toBeNull();
    });

    it('should return null when no cycles exist', async () => {
      mockCycleService.findMany.mockResolvedValue([]);

      const result = await service.getRelevantCycleId(1);

      expect(result).toBeNull();
    });

    it('should sort cycles by from_date in ascending order', async () => {
      const unsortedCycles = [
        {
          id: 3,
          code: 'CYCLE_2025_2',
          from_date: new Date('2025-06-01'),
          to_date: new Date('2025-11-30'),
          cycleProgram: { program_id: 1 },
        },
        mockFutureCycle,
      ];
      mockCycleService.findMany.mockResolvedValue(unsortedCycles);

      const result = await service.getRelevantCycleId(1);

      expect(result).toEqual(mockFutureCycle); // Should return the earlier future cycle
    });
  });

  describe('getLatestCycle', () => {
    it('should return the cycle with the highest numeric code suffix', async () => {
      const cycles = [
        { id: 1, code: 'CYCLE_2024_1', cycleProgram: { program_id: 1 } },
        { id: 2, code: 'CYCLE_2024_10', cycleProgram: { program_id: 1 } },
        { id: 3, code: 'CYCLE_2024_2', cycleProgram: { program_id: 1 } },
      ];
      mockCycleService.findMany.mockResolvedValue(cycles);

      const result = await service.getLatestCycle(1);

      expect(mockCycleService.findMany).toHaveBeenCalledWith(
        { cycleProgram: { program_id: 1 } },
        ['cycleProgram']
      );
      
      // CYCLE_2024_10 has the highest numeric suffix (10), so it should be returned first
      // The service sorts by numeric suffix in descending order, so CYCLE_2024_10 comes first
      const expectedCycle = cycles.find(c => c.code === 'CYCLE_2024_10');
      expect(result).toEqual(expectedCycle);
    });

    it('should handle cycles with no numeric suffix', async () => {
      const cycles = [
        { id: 1, code: 'CYCLE_2024', cycleProgram: { program_id: 1 } },
        { id: 2, code: 'CYCLE_2024_SPECIAL', cycleProgram: { program_id: 1 } },
      ];
      mockCycleService.findMany.mockResolvedValue(cycles);

      const result = await service.getLatestCycle(1);

      expect(result).toEqual(cycles[0]); // Should return first cycle when no numeric suffix
    });

    it('should return null when no cycles exist', async () => {
      mockCycleService.findMany.mockResolvedValue([]);

      const result = await service.getLatestCycle(1);

      expect(result).toBeNull();
    });

    it('should handle single cycle', async () => {
      const singleCycle = [{ id: 1, code: 'CYCLE_2024_1', cycleProgram: { program_id: 1 } }];
      mockCycleService.findMany.mockResolvedValue(singleCycle);

      const result = await service.getLatestCycle(1);

      expect(result).toEqual(singleCycle[0]);
    });
  });

  describe('batchUpdate', () => {
    it('should update multiple applications in batch', async () => {
      const updates = [
        { id: 1, data: { status: 'approved' } },
        { id: 2, data: { status: 'rejected' } },
      ];

      await service.batchUpdate(updates);

      expect(mockApplicationRepository.save).toHaveBeenCalledWith(
        { id: 1, status: 'approved' },
        { id: 2, status: 'rejected' }
      );
    });

    it('should not call save when updates array is empty', async () => {
      await service.batchUpdate([]);

      expect(mockApplicationRepository.save).not.toHaveBeenCalled();
    });

    it('should handle single update', async () => {
      const updates = [{ id: 1, data: { status: 'approved' } }];

      await service.batchUpdate(updates);

      expect(mockApplicationRepository.save).toHaveBeenCalledWith(
        { id: 1, status: 'approved' }
      );
    });

    it('should merge id with data for each update', async () => {
      const updates = [
        { id: 1, data: { status: 'approved', notes: 'Good candidate' } },
      ];

      await service.batchUpdate(updates);

      expect(mockApplicationRepository.save).toHaveBeenCalledWith({
        id: 1,
        status: 'approved',
        notes: 'Good candidate',
      });
    });
  });

  describe('inheritance from BaseService', () => {
    it('should have access to BaseService methods', () => {
      expect(service).toHaveProperty('findMany');
      expect(service).toHaveProperty('findOne');
      expect(service).toHaveProperty('create');
      expect(service).toHaveProperty('update');
      expect(service).toHaveProperty('delete');
    });

    it('should use the correct repository', () => {
      expect(service['repository']).toBe(applicationRepository);
    });
  });
});
