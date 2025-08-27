import { Test, TestingModule } from '@nestjs/testing';
import { CycleMediator } from '../cycle.mediator';
import { CycleService } from '../cycle.service';
import { ProgramService } from '../../programs/program.service';
import { CreateEditCycleDto } from '../dtos/create.cycle.dto';
import { Admin, In } from 'typeorm';
import { Cycles } from '../../../core/data/database/entities/cycle.entity';
import { Program } from '../../../core/data/database/entities/program.entity';

// Mock CycleProgram entity
jest.mock('../../../core/data/database/relations/cycle-program.entity', () => ({
  CycleProgram: jest.fn().mockImplementation(() => ({
    cycle_id: 0,
    program_id: 0,
    save: jest.fn().mockResolvedValue({ id: 1, cycle_id: 1, program_id: 1 }),
  })),
}));

describe('CycleMediator', () => {
  let mediator: CycleMediator;
  let cycleService: CycleService;
  let programService: ProgramService;
  let module: TestingModule;

  const mockCycleService = {
    findMany: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    generateCycleCode: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
  };

  const mockProgramService = {
    findOne: jest.fn(),
  };

  const mockAdmin: Admin = {
    id: 1,
    email: 'admin@example.com',
    name: 'Test Admin',
  } as any;

  const mockProgram: Program = {
    id: 1,
    program_name: 'Test Program',
    abbreviation: 'TEST',
  } as any;

    const mockCycle: Cycles = {
    id: 1,
    name: 'Test Cycle',
    code: 'TEST001',
    from_date: new Date('2024-01-01'),
    to_date: new Date('2024-12-31'),
    cycleProgram: {
      id: 1,
      program: {
        id: 1,
        program_name: 'Test Program',
        abbreviation: 'TEST',
      },
    },
  } as any;

  const mockCreateEditCycleDto: CreateEditCycleDto = {
    programId: 1,
    cycleName: 'Test Cycle',
    fromDate: new Date('2024-01-01'),
    toDate: new Date('2024-12-31'),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CycleMediator,
        {
          provide: CycleService,
          useValue: mockCycleService,
        },
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
      ],
    }).compile();

    mediator = module.get<CycleMediator>(CycleMediator);
    cycleService = module.get<CycleService>(CycleService);
    programService = module.get<ProgramService>(ProgramService);
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

  describe('findCycles', () => {
    it('should find cycles by program ID', async () => {
      const programId = 1;
      const mockResponse = {
        cycles: [{
          id: 1,
          name: 'Test Cycle',
          code: 'TEST001',
          cycleProgram: {
            id: 1,
            program: {
              id: 1,
              programName: 'Test Program',
              abbreviation: 'TEST',
            },
          },
          fromDate: '2024-01-01T00:00:00.000Z',
          toDate: '2024-12-31T00:00:00.000Z',
          abbreviation: 'TEST',
          programName: 'Test Program',
        }],
        total: 1,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleService.findAndCount.mockResolvedValue([[mockCycle], 1]);

      const result = await mediator.findCycles(programId);

      expect(mockCycleService.findAndCount).toHaveBeenCalledWith(
        { cycleProgram: { program: { id: programId } } },
        ['cycleProgram', 'decisionDateCycle', 'thresholdCycle'],
        undefined,
        0,
        10000000
      );
      expect(result).toEqual(mockResponse);
    });

    it('should find all cycles when no program ID provided', async () => {
      const mockResponse = {
        cycles: [{
          id: 1,
          name: 'Test Cycle',
          code: 'TEST001',
          cycleProgram: {
            id: 1,
            program: {
              id: 1,
              programName: 'Test Program',
              abbreviation: 'TEST',
            },
          },
          fromDate: '2024-01-01T00:00:00.000Z',
          toDate: '2024-12-31T00:00:00.000Z',
          abbreviation: 'TEST',
          programName: 'Test Program',
        }],
        total: 1,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleService.findAndCount.mockResolvedValue([[mockCycle], 1]);

      const result = await mediator.findCycles();

      expect(mockCycleService.findAndCount).toHaveBeenCalledWith(
        {},
        ['cycleProgram', 'decisionDateCycle', 'thresholdCycle'],
        undefined,
        0,
        10000000
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty cycles result', async () => {
      const mockResponse = {
        cycles: [],
        total: 0,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleService.findAndCount.mockResolvedValue([[], 0]);

      const result = await mediator.findCycles(1);

      expect(result).toEqual(mockResponse);
    });

    it('should handle multiple cycles result', async () => {
      const mockCycles = [mockCycle, { ...mockCycle, id: 2, name: 'Cycle 2' }];
      const mockResponse = {
        cycles: mockCycles.map((cycle, index) => ({
          id: cycle.id,
          name: cycle.name,
          code: cycle.code,
          cycleProgram: {
            id: 1,
            program: {
              id: 1,
              programName: 'Test Program',
              abbreviation: 'TEST',
            },
          },
          fromDate: '2024-01-01T00:00:00.000Z',
          toDate: '2024-12-31T00:00:00.000Z',
          abbreviation: 'TEST',
          programName: 'Test Program',
        })),
        total: 2,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleService.findAndCount.mockResolvedValue([mockCycles, 2]);

      const result = await mediator.findCycles(1);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('createEditCycle', () => {
    it('should create a new cycle', async () => {
      const mockGeneratedCode = 'TEST001';
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.generateCycleCode.mockResolvedValue(mockGeneratedCode);
      mockCycleService.save.mockResolvedValue(mockCycle);
      
      // Mock the second findOne call that gets the saved cycle with relations
      mockCycleService.findOne.mockResolvedValueOnce(null); // First call: check for existing cycle
      mockCycleService.findOne.mockResolvedValueOnce({ // Second call: get saved cycle with relations
        ...mockCycle,
        cycleProgram: {
          id: 1,
          program: mockProgram,
        },
      });

      const result = await mediator.createEditCycle(mockAdmin, mockCreateEditCycleDto);

      expect(mockProgramService.findOne).toHaveBeenCalledWith({ id: mockCreateEditCycleDto.programId });
      expect(mockCycleService.generateCycleCode).toHaveBeenCalledWith(
        mockProgram.abbreviation,
        mockCreateEditCycleDto.programId
      );
      expect(mockCycleService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateEditCycleDto.cycleName,
          code: mockGeneratedCode,
          from_date: mockCreateEditCycleDto.fromDate,
          to_date: mockCreateEditCycleDto.toDate,
        })
      );
      expect(mockCycleService.save).toHaveBeenCalled();
      expect(result).toEqual({ 
        message: 'Cycle created succesfully.', 
        cycle: expect.any(Object) 
      });
    });

    it('should edit an existing cycle', async () => {
      const editDto = {
        ...mockCreateEditCycleDto,
        cycleId: 1,
      };
      const existingCycle = { ...mockCycle, name: 'Old Name' };
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.findOne.mockResolvedValue(existingCycle);
      mockCycleService.save.mockResolvedValue({ ...existingCycle, name: editDto.cycleName });

      const result = await mediator.createEditCycle(mockAdmin, editDto);

      expect(mockCycleService.findOne).toHaveBeenCalledWith({ id: editDto.cycleId }, ['cycleProgram']);
      expect(mockCycleService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: editDto.cycleId,
          name: editDto.cycleName,
          from_date: editDto.fromDate,
          to_date: editDto.toDate,
        })
      );
      expect(result).toEqual({ message: 'Cycle updated succesfully.', cycle: expect.any(Object) });
    });

    it('should throw error when program not found', async () => {
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(null);

      await expect(mediator.createEditCycle(mockAdmin, mockCreateEditCycleDto))
        .rejects.toThrow('Program with the provided ID does not exist.');
    });

    it('should throw error when editing non-existent cycle', async () => {
      const editDto = {
        ...mockCreateEditCycleDto,
        cycleId: 999,
      };
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.findOne.mockResolvedValue(null);

      await expect(mediator.createEditCycle(mockAdmin, editDto))
        .rejects.toThrow('Cycle with ID 999 not found');
    });

    it('should handle cycle with minimal data', async () => {
      const minimalDto = { programId: 1 };
      const mockGeneratedCode = 'TEST001';
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.generateCycleCode.mockResolvedValue(mockGeneratedCode);
      mockCycleService.save.mockResolvedValue(mockCycle);
      
      // Mock the second findOne call that gets the saved cycle with relations
      mockCycleService.findOne.mockResolvedValueOnce(null); // First call: check for existing cycle
      mockCycleService.findOne.mockResolvedValueOnce({ // Second call: get saved cycle with relations
        ...mockCycle,
        cycleProgram: {
          id: 1,
          program: mockProgram,
        },
      });

      const result = await mediator.createEditCycle(mockAdmin, minimalDto);

      expect(mockCycleService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: undefined,
          code: mockGeneratedCode,
          from_date: undefined,
          to_date: undefined,
        })
      );
      expect(mockCycleService.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Cycle created succesfully.', cycle: expect.any(Object) });
    });

    it('should handle cycle with all optional fields', async () => {
      const fullDto = {
        ...mockCreateEditCycleDto,
        cycleId: 1,
        fromDate: new Date('2024-06-01'),
        toDate: new Date('2024-08-31'),
      };
      const existingCycle = { ...mockCycle };
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.findOne.mockResolvedValue(existingCycle);
      mockCycleService.save.mockResolvedValue({ ...existingCycle, ...fullDto });

      const result = await mediator.createEditCycle(mockAdmin, fullDto);

      expect(mockCycleService.findOne).toHaveBeenCalledWith({ id: fullDto.cycleId }, ['cycleProgram']);
      expect(mockCycleService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fullDto.cycleId,
          name: fullDto.cycleName,
          from_date: fullDto.fromDate,
          to_date: fullDto.toDate,
        })
      );
      expect(result).toEqual({ message: 'Cycle updated succesfully.', cycle: expect.any(Object) });
    });
  });

  describe('deleteCycle', () => {
    it('should delete a single cycle', async () => {
      const cycleId = '1';
      const cycleToDelete = { ...mockCycle, id: 1 };
      mockCycleService.findMany.mockResolvedValue([cycleToDelete]);
      mockCycleService.delete.mockResolvedValue({ affected: 1 });

      const result = await mediator.deleteCycle(cycleId);

      expect(mockCycleService.findMany).toHaveBeenCalledWith(
        { id: In(['1']) },
        ['cycleProgram', 'decisionDateCycle', 'thresholdCycle']
      );
      expect(mockCycleService.delete).toHaveBeenCalledWith({ id: In([1]) });
      expect(result).toEqual({ message: 'Cycle(s) successfully deleted', deletedIds: [1] });
    });

    it('should delete multiple cycles', async () => {
      const cycleIds = ['1', '2', '3'];
      const cyclesToDelete = [
        { ...mockCycle, id: 1 },
        { ...mockCycle, id: 2 },
        { ...mockCycle, id: 3 },
      ];
      mockCycleService.findMany.mockResolvedValue(cyclesToDelete);
      mockCycleService.delete.mockResolvedValue({ affected: 3 });

      const result = await mediator.deleteCycle(cycleIds);

      expect(mockCycleService.findMany).toHaveBeenCalledTimes(1);
      expect(mockCycleService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Cycle(s) successfully deleted', deletedIds: [1, 2, 3] });
    });

    it('should handle cycle not found for deletion gracefully', async () => {
      const cycleId = '999';
      mockCycleService.findMany.mockResolvedValue([]);

      await expect(mediator.deleteCycle(cycleId))
        .rejects.toThrow('No cycles with the provided ID(s) exist.');
    });

    it('should handle empty array of cycle IDs', async () => {
      const cycleIds: string[] = [];

      await expect(mediator.deleteCycle(cycleIds))
        .rejects.toThrow('No cycles with the provided ID(s) exist.');
    });

    it('should handle single numeric string', async () => {
      const cycleId = '123';
      const cycleToDelete = { ...mockCycle, id: 123 };
      mockCycleService.findMany.mockResolvedValue([cycleToDelete]);
      mockCycleService.delete.mockResolvedValue({ affected: 1 });

      const result = await mediator.deleteCycle(cycleId);

      expect(mockCycleService.findMany).toHaveBeenCalledWith(
        { id: In(['123']) },
        ['cycleProgram', 'decisionDateCycle', 'thresholdCycle']
      );
      expect(mockCycleService.delete).toHaveBeenCalledWith({ id: In([123]) });
      expect(result).toEqual({ message: 'Cycle(s) successfully deleted', deletedIds: [123] });
    });

    it('should handle mixed array of cycle IDs', async () => {
      const cycleIds = ['1', 'abc', '3'];
      const validCycles = [
        { ...mockCycle, id: 1 },
        { ...mockCycle, id: 3 },
      ];
      mockCycleService.findMany.mockResolvedValue(validCycles);
      mockCycleService.delete.mockResolvedValue({ affected: 2 });

      const result = await mediator.deleteCycle(cycleIds);

      expect(mockCycleService.findMany).toHaveBeenCalledTimes(1);
      expect(mockCycleService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Cycle(s) successfully deleted', deletedIds: [1, 3] });
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof mediator.findCycles).toBe('function');
      expect(typeof mediator.createEditCycle).toBe('function');
      expect(typeof mediator.deleteCycle).toBe('function');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['cycleService']).toBeDefined();
      expect(mediator['programService']).toBeDefined();
      expect(mediator['cycleService']).toBe(cycleService);
      expect(mediator['programService']).toBe(programService);
    });
  });

  describe('error handling', () => {
    it('should handle service errors gracefully', async () => {
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockRejectedValue(new Error('Database error'));

      await expect(mediator.createEditCycle(mockAdmin, mockCreateEditCycleDto))
        .rejects.toThrow('Database error');
    });

    it('should handle validation errors', async () => {
      const invalidDto = { programId: -1 };
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(null);

      await expect(mediator.createEditCycle(mockAdmin, invalidDto as any))
        .rejects.toThrow('Program with the provided ID does not exist.');
    });
  });

  describe('data transformation', () => {
    it('should properly transform DTO to entity structure', async () => {
      const mockGeneratedCode = 'TEST001';
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.generateCycleCode.mockResolvedValue(mockGeneratedCode);
      mockCycleService.save.mockResolvedValue(mockCycle);
      
      // Mock the second findOne call that gets the saved cycle with relations
      mockCycleService.findOne.mockResolvedValueOnce(null); // First call: check for existing cycle
      mockCycleService.findOne.mockResolvedValueOnce({ // Second call: get saved cycle with relations
        ...mockCycle,
        cycleProgram: {
          id: 1,
          program: mockProgram,
        },
      });

      await mediator.createEditCycle(mockAdmin, mockCreateEditCycleDto);

      expect(mockCycleService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateEditCycleDto.cycleName,
          from_date: mockCreateEditCycleDto.fromDate,
          to_date: mockCreateEditCycleDto.toDate,
        })
      );
    });

    it('should handle date conversion correctly', async () => {
      const dtoWithDates = {
        ...mockCreateEditCycleDto,
        fromDate: '2024-01-01' as any,
        toDate: '2024-12-31' as any,
      };
      const mockGeneratedCode = 'TEST001';
      mockCycleService.findOne.mockResolvedValue(null); // No existing cycle with same name
      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockCycleService.generateCycleCode.mockResolvedValue(mockGeneratedCode);
      mockCycleService.save.mockResolvedValue(mockCycle);
      
      // Mock the second findOne call that gets the saved cycle with relations
      mockCycleService.findOne.mockResolvedValueOnce(null); // First call: check for existing cycle
      mockCycleService.findOne.mockResolvedValueOnce({ // Second call: get saved cycle with relations
        ...mockCycle,
        cycleProgram: {
          id: 1,
          program: mockProgram,
        },
      });

      await mediator.createEditCycle(mockAdmin, dtoWithDates);

      expect(mockCycleService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          from_date: dtoWithDates.fromDate,
          to_date: dtoWithDates.toDate,
        })
      );
    });
  });
});
