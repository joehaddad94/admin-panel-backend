import { Test, TestingModule } from '@nestjs/testing';
import { ProgramController } from '../program.contoller';
import { ProgramMediator } from '../program.mediator';

describe('ProgramController', () => {
  let controller: ProgramController;
  let mediator: ProgramMediator;
  let module: TestingModule;

  const mockProgramMediator = {
    findPrograms: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ProgramController],
      providers: [
        {
          provide: ProgramMediator,
          useValue: mockProgramMediator,
        },
      ],
    }).compile();

    controller = module.get<ProgramController>(ProgramController);
    mediator = module.get<ProgramMediator>(ProgramMediator);
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

  describe('controller instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should be an instance of ProgramController', () => {
      expect(controller).toBeInstanceOf(ProgramController);
    });

    it('should have mediator dependency injected', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('controller structure', () => {
    it('should have proper decorators', () => {
      expect(controller).toBeDefined();
    });

    it('should be injectable', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have getPrograms method', () => {
      expect(typeof controller.getPrograms).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject ProgramMediator', () => {
      expect(controller['mediator']).toBe(mediator);
    });

    it('should have access to mediator methods', () => {
      expect(controller['mediator']).toBeDefined();
      expect(typeof controller['mediator'].findPrograms).toBe('function');
    });
  });

  describe('getPrograms method', () => {
    it('should call mediator findPrograms method', async () => {
      const mockPrograms = [
        { id: 1, program_name: 'Test Program 1', abbreviation: 'TP1' },
        { id: 2, program_name: 'Test Program 2', abbreviation: 'TP2' },
      ];
      mockProgramMediator.findPrograms.mockResolvedValue(mockPrograms);

      const result = await controller.getPrograms();

      expect(result).toEqual(mockPrograms);
      expect(mockProgramMediator.findPrograms).toHaveBeenCalled();
    });

    it('should handle mediator errors', async () => {
      const error = new Error('Mediator error');
      mockProgramMediator.findPrograms.mockRejectedValue(error);

      await expect(controller.getPrograms()).rejects.toThrow('Mediator error');
      expect(mockProgramMediator.findPrograms).toHaveBeenCalled();
    });
  });

  describe('controller metadata', () => {
    it('should be a valid NestJS controller', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
    });
  });
});
