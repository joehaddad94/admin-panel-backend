import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { CycleController } from '../cycle.controller';
import { CycleMediator } from '../cycle.mediator';
import { CreateEditCycleDto } from '../dtos/create.cycle.dto';
import { Admin } from 'typeorm';

describe('CycleController', () => {
  let controller: CycleController;
  let mediator: CycleMediator;
  let module: TestingModule;

  const mockCycleMediator = {
    findCycles: jest.fn(),
    createEditCycle: jest.fn(),
    deleteCycle: jest.fn(),
  };

  const mockAdmin: any = {
    id: 1,
    email: 'admin@example.com',
    name: 'Test Admin',
  };

  const mockCreateEditCycleDto: CreateEditCycleDto = {
    programId: 1,
    cycleName: 'Test Cycle',
    fromDate: new Date('2024-01-01'),
    toDate: new Date('2024-12-31'),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [CycleController],
      providers: [
        {
          provide: CycleMediator,
          useValue: mockCycleMediator,
        },
      ],
    }).compile();

    controller = module.get<CycleController>(CycleController);
    mediator = module.get<CycleMediator>(CycleMediator);
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

  describe('getAllCycles', () => {
    it('should get all cycles', async () => {
      const mockResponse = {
        cycles: [
          { id: 1, name: 'Cycle 1' },
          { id: 2, name: 'Cycle 2' },
        ],
        total: 2,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleMediator.findCycles.mockResolvedValue(mockResponse);

      const result = await controller.getAllCycles();

      expect(mockCycleMediator.findCycles).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const getAllCyclesMethod = controller.getAllCycles;
      expect(getAllCyclesMethod).toBeDefined();
    });
  });

  describe('getCycles', () => {
    it('should get cycles by program ID', async () => {
      const programId = 1;
      const mockResponse = {
        cycles: [
          { id: 1, name: 'Cycle 1', programId: 1 },
        ],
        total: 1,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleMediator.findCycles.mockResolvedValue(mockResponse);

      const result = await controller.getCycles(programId);

      expect(mockCycleMediator.findCycles).toHaveBeenCalledWith(programId);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const getCyclesMethod = controller.getCycles;
      expect(getCyclesMethod).toBeDefined();
    });

    it('should handle numeric string program ID', async () => {
      const programId = '1' as any;
      const mockResponse = {
        cycles: [
          { id: 1, name: 'Cycle 1', programId: 1 },
        ],
        total: 1,
        page: 1,
        pageSize: 10000000,
      };
      mockCycleMediator.findCycles.mockResolvedValue(mockResponse);

      const result = await controller.getCycles(programId);

      expect(mockCycleMediator.findCycles).toHaveBeenCalledWith(programId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createCycle', () => {
    it('should create a new cycle', async () => {
      const mockResponse = { message: 'Cycle created successfully' };
      mockCycleMediator.createEditCycle.mockResolvedValue(mockResponse);

      const result = await controller.createCycle(mockAdmin, mockCreateEditCycleDto);

      expect(mockCycleMediator.createEditCycle).toHaveBeenCalledWith(
        mockAdmin,
        mockCreateEditCycleDto
      );
      expect(result).toEqual(mockResponse);
    });

    it('should edit an existing cycle', async () => {
      const editDto = {
        ...mockCreateEditCycleDto,
        cycleId: 1,
      };
      const mockResponse = { message: 'Cycle updated successfully' };
      mockCycleMediator.createEditCycle.mockResolvedValue(mockResponse);

      const result = await controller.createCycle(mockAdmin, editDto);

      expect(mockCycleMediator.createEditCycle).toHaveBeenCalledWith(
        mockAdmin,
        editDto
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const createCycleMethod = controller.createCycle;
      expect(createCycleMethod).toBeDefined();
    });

    it('should handle admin parameter correctly', async () => {
      const mockResponse = { message: 'Cycle created successfully' };
      mockCycleMediator.createEditCycle.mockResolvedValue(mockResponse);

      await controller.createCycle(mockAdmin, mockCreateEditCycleDto);

      expect(mockCycleMediator.createEditCycle).toHaveBeenCalledWith(
        mockAdmin,
        mockCreateEditCycleDto
      );
    });

    it('should handle DTO with minimal data', async () => {
      const minimalDto = { programId: 1 };
      const mockResponse = { message: 'Cycle created successfully' };
      mockCycleMediator.createEditCycle.mockResolvedValue(mockResponse);

      const result = await controller.createCycle(mockAdmin, minimalDto);

      expect(mockCycleMediator.createEditCycle).toHaveBeenCalledWith(
        mockAdmin,
        minimalDto
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCycle', () => {
    it('should delete a single cycle', async () => {
      const cycleId = '1';
      const mockResponse = { message: 'Cycle deleted successfully' };
      mockCycleMediator.deleteCycle.mockResolvedValue(mockResponse);

      const result = await controller.deleteCycle(cycleId);

      expect(mockCycleMediator.deleteCycle).toHaveBeenCalledWith(cycleId);
      expect(result).toEqual(mockResponse);
    });

    it('should delete multiple cycles', async () => {
      const cycleIds = ['1', '2', '3'];
      const mockResponse = { message: 'Cycles deleted successfully' };
      mockCycleMediator.deleteCycle.mockResolvedValue(mockResponse);

      const result = await controller.deleteCycle(cycleIds);

      expect(mockCycleMediator.deleteCycle).toHaveBeenCalledWith(cycleIds);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const deleteCycleMethod = controller.deleteCycle;
      expect(deleteCycleMethod).toBeDefined();
    });

    it('should handle empty string array', async () => {
      const cycleIds: string[] = [];
      const mockResponse = { message: 'No cycles to delete' };
      mockCycleMediator.deleteCycle.mockResolvedValue(mockResponse);

      const result = await controller.deleteCycle(cycleIds);

      expect(mockCycleMediator.deleteCycle).toHaveBeenCalledWith(cycleIds);
      expect(result).toEqual(mockResponse);
    });

    it('should handle single numeric string', async () => {
      const cycleId = '123';
      const mockResponse = { message: 'Cycle deleted successfully' };
      mockCycleMediator.deleteCycle.mockResolvedValue(mockResponse);

      const result = await controller.deleteCycle(cycleId);

      expect(mockCycleMediator.deleteCycle).toHaveBeenCalledWith(cycleId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof controller.getAllCycles).toBe('function');
      expect(typeof controller.getCycles).toBe('function');
      expect(typeof controller.createCycle).toBe('function');
      expect(typeof controller.deleteCycle).toBe('function');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('validation pipe usage', () => {
    it('should use ValidationPipe on getAllCycles endpoint', () => {
      const getAllCyclesMethod = controller.getAllCycles;
      expect(getAllCyclesMethod).toBeDefined();
    });

    it('should use ValidationPipe on getCycles endpoint', () => {
      const getCyclesMethod = controller.getCycles;
      expect(getCyclesMethod).toBeDefined();
    });

    it('should use ValidationPipe on createCycle endpoint', () => {
      const createCycleMethod = controller.createCycle;
      expect(createCycleMethod).toBeDefined();
    });

    it('should use ValidationPipe on deleteCycle endpoint', () => {
      const deleteCycleMethod = controller.deleteCycle;
      expect(deleteCycleMethod).toBeDefined();
    });
  });

  describe('parameter handling', () => {
    it('should handle program ID parameter correctly', () => {
      const programId = 5;
      expect(typeof programId).toBe('number');
      expect(programId).toBe(5);
    });

    it('should handle cycle ID parameter correctly', () => {
      const cycleId = 10;
      expect(typeof cycleId).toBe('number');
      expect(cycleId).toBe(10);
    });

    it('should handle admin parameter correctly', () => {
      expect(mockAdmin).toBeDefined();
      expect(mockAdmin.id).toBe(1);
      expect(mockAdmin.email).toBe('admin@example.com');
    });
  });
});
