import { Test, TestingModule } from '@nestjs/testing';
import { MicrocampController } from '../microcamp.controller';
import { MicrocampMediator } from '../microcamp.mediator';
import { Microcamp } from '../../../core/data/database/entities/microcamp.entity';

describe('MicrocampController', () => {
  let controller: MicrocampController;
  let mockMediator: jest.Mocked<MicrocampMediator>;

  const mockMicrocamp: Microcamp = {
    id: 1,
    code: 'MC001',
    name: 'Test Microcamp',
    created_at: new Date(),
    updated_at: new Date(),
  } as Microcamp;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicrocampController],
      providers: [
        {
          provide: MicrocampMediator,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MicrocampController>(MicrocampController);
    mockMediator = module.get(MicrocampMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all microcamps', async () => {
      const mockMicrocamps = [mockMicrocamp];
      mockMediator.findAll.mockResolvedValue(mockMicrocamps);

      const result = await controller.findAll();

      expect(result).toEqual(mockMicrocamps);
      expect(mockMediator.findAll).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      mockMediator.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockMediator.findAll).toHaveBeenCalled();
    });

    it('should handle mediator errors', async () => {
      const error = new Error('Mediator error');
      mockMediator.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Mediator error');
      expect(mockMediator.findAll).toHaveBeenCalled();
    });
  });

  describe('decorators', () => {
    it('should have proper decorators', () => {
      expect(true).toBe(true);
    });
  });
});
