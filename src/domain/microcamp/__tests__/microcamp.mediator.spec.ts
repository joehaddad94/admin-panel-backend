import { Test, TestingModule } from '@nestjs/testing';
import { MicrocampMediator } from '../microcamp.mediator';
import { MicrocampService } from '../microcamp.service';
import { Microcamp } from '../../../core/data/database/entities/microcamp.entity';

describe('MicrocampMediator', () => {
  let mediator: MicrocampMediator;
  let mockService: jest.Mocked<MicrocampService>;

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
        MicrocampMediator,
        {
          provide: MicrocampService,
          useValue: {
            getAll: jest.fn(),
            findOne: jest.fn(),
            findMany: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
            getQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    mediator = module.get<MicrocampMediator>(MicrocampMediator);
    mockService = module.get(MicrocampService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all microcamps', async () => {
      const mockMicrocamps = [mockMicrocamp];
      mockService.findMany.mockResolvedValue(mockMicrocamps);

      const result = await mediator.findAll();

      expect(result).toEqual(mockMicrocamps);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle empty result', async () => {
      mockService.findMany.mockResolvedValue([]);

      const result = await mediator.findAll();

      expect(result).toEqual([]);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockService.findMany.mockRejectedValue(error);

      await expect(mediator.findAll()).rejects.toThrow('Service error');
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });
});
