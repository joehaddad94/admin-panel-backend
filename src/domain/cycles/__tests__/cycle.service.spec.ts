import { Test, TestingModule } from '@nestjs/testing';
import { CycleService } from '../cycle.service';
import { CycleRepository } from '../cycle.repository';
import { Cycles } from '../../../core/data/database/entities/cycle.entity';

describe('CycleService', () => {
  let service: CycleService;
  let cycleRepository: CycleRepository;
  let module: TestingModule;

  const mockCycleRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    findMany: jest.fn(),
  };

  const mockCycle = {
    id: 1,
    code: 'SEFFSE20240001',
    name: 'Test Cycle',
    from_date: new Date('2024-01-01'),
    to_date: new Date('2024-12-31'),
    cycleProgram: {
      program_id: 1,
      program: {
        id: 1,
        program_name: 'Full Stack Engineering',
        abbreviation: 'FSE',
      },
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CycleService,
        {
          provide: CycleRepository,
          useValue: mockCycleRepository,
        },
      ],
    }).compile();

    service = module.get<CycleService>(CycleService);
    cycleRepository = module.get<CycleRepository>(CycleRepository);
    
    // Mock the date to 2024
    const mockDate = new Date('2024-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    jest.spyOn(mockDate, 'getFullYear').mockReturnValue(2024);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    if (module) {
      await module.close();
    }
  });

  describe('generateCycleCode', () => {
    it('should generate cycle code for first cycle', async () => {
      mockCycleRepository.findOne.mockResolvedValue(null);

      const result = await service.generateCycleCode('FSE', 1);

      expect(mockCycleRepository.findOne).toHaveBeenCalledWith({
        where: { cycleProgram: { program_id: 1 } },
        order: { code: 'DESC' },
        relations: ['cycleProgram'],
      });
      expect(result).toMatch(/^SEFFSE\d{6}$/);
      expect(result).toContain('FSE');
    });

    it('should generate cycle code with incremented number', async () => {
      const existingCycle = {
        ...mockCycle,
        code: 'SEFFSE240001',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240002');
    });

    it('should handle multiple digits in existing code', async () => {
      const existingCycle = {
        ...mockCycle,
        code: 'SEFFSE240099',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240100');
    });

    it('should handle different program abbreviations', async () => {
      mockCycleRepository.findOne.mockResolvedValue(null);

      const result = await service.generateCycleCode('BDE', 2);

      expect(result).toMatch(/^SEFBDE\d{6}$/);
      expect(result).toContain('BDE');
    });

    it('should handle year changes', async () => {
      // Mock the current year to be 2025
      const originalDate = global.Date;
      const mockDate = new Date('2025-06-01');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      jest.spyOn(mockDate, 'getFullYear').mockReturnValue(2025);

      mockCycleRepository.findOne.mockResolvedValue(null);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toMatch(/^SEFFSE25\d{4}$/);
      expect(result).toContain('25');

      // Restore original Date
      global.Date = originalDate;
      jest.restoreAllMocks();
    });

    it('should handle zero increment', async () => {
      const existingCycle = {
        ...mockCycle,
        code: 'SEFFSE240000',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240001');
    });

    it('should handle large increment numbers', async () => {
      const existingCycle = {
        ...mockCycle,
        code: 'SEFFSE249999',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE2410000');
    });

    it('should handle missing cycleProgram relation gracefully', async () => {
      const existingCycle = {
        ...mockCycle,
        cycleProgram: null,
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240002');
    });

    it('should handle malformed existing codes', async () => {
      const existingCycle = {
        ...mockCycle,
        code: 'INVALID_CODE',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240NaN');
    });

    it('should handle empty string existing codes', async () => {
      const existingCycle = {
        ...mockCycle,
        code: '',
      };
      mockCycleRepository.findOne.mockResolvedValue(existingCycle);

      const result = await service.generateCycleCode('FSE', 1);

      expect(result).toBe('SEFFSE240001');
    });
  });

  describe('inheritance from BaseService', () => {
    it('should have access to BaseService methods', () => {
      expect(service).toHaveProperty('findMany');
      expect(service).toHaveProperty('findOne');
      expect(service).toHaveProperty('create');
      expect(service).toHaveProperty('update');
      expect(service).toHaveProperty('delete');
      expect(service).toHaveProperty('findAndCount');
    });

    it('should use the correct repository', () => {
      expect(service['repository']).toBe(cycleRepository);
    });

    it('should delegate findMany to repository', async () => {
      const mockData = [{ id: 1, name: 'Cycle 1' }];
      mockCycleRepository.findMany.mockResolvedValue(mockData);

      const result = await service.findMany({ name: 'Cycle 1' });

      expect(mockCycleRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'Cycle 1' },
          relations: undefined,
          select: null,
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should delegate findOne to repository', async () => {
      const mockData = { id: 1, name: 'Cycle 1' };
      mockCycleRepository.findOne.mockResolvedValue(mockData);

      const result = await service.findOne({ id: 1 });

      expect(mockCycleRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should delegate save to repository', async () => {
      const mockData = { id: 1, name: 'Cycle 1' };
      mockCycleRepository.save.mockResolvedValue(mockData);

      const result = await service.save(mockData);

      expect(mockCycleRepository.save).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it('should delegate update to repository', async () => {
      const mockResult = { affected: 1 };
      mockCycleRepository.update.mockResolvedValue(mockResult);

      const result = await service.update({ id: 1 }, { name: 'Updated Cycle' });

      expect(mockCycleRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { name: 'Updated Cycle' }
      );
      expect(result).toEqual(mockResult);
    });

    it('should delegate delete to repository', async () => {
      const mockResult = { affected: 1 };
      mockCycleRepository.delete.mockResolvedValue(mockResult);

      const result = await service.delete({ id: 1 });

      expect(mockCycleRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockResult);
    });
  });
});
