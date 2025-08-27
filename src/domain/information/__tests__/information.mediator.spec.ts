import { Test, TestingModule } from '@nestjs/testing';
import { InformationMediator } from '../informattion.mediator';
import { InformationService } from '../information.service';

describe('InformationMediator', () => {
  let mediator: InformationMediator;
  let service: InformationService;

  const mockService = {
    findMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationMediator,
        {
          provide: InformationService,
          useValue: mockService,
        },
      ],
    }).compile();

    mediator = module.get<InformationMediator>(InformationMediator);
    service = module.get<InformationService>(InformationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of InformationMediator', () => {
      expect(mediator).toBeInstanceOf(InformationMediator);
    });

    it('should have service injected', () => {
      expect(service).toBeDefined();
    });

    it('should have all required methods', () => {
      expect(typeof mediator.findInformation).toBe('function');
    });
  });

  describe('findInformation', () => {
    it('should successfully return information when found', async () => {
      const mockInformation = [
        { id: 1, first_name: 'Test Information 1', last_name: 'Last Name 1' },
        { id: 2, first_name: 'Test Information 2', last_name: 'Last Name 2' },
      ];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result = await mediator.findInformation();

      expect(result).toEqual(mockInformation);
      expect(mockService.findMany).toHaveBeenCalledWith({});
      expect(mockService.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle single information item', async () => {
      const mockInformation = [{ id: 1, first_name: 'Single Information', last_name: 'Single Last Name' }];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result = await mediator.findInformation();

      expect(result).toEqual(mockInformation);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle empty array result', async () => {
      const mockInformation = [];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result = await mediator.findInformation();

      expect(result).toEqual(mockInformation);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should call service with empty where clause', async () => {
      const mockInformation = [{ id: 1, first_name: 'Test Information' }];
      mockService.findMany.mockResolvedValue(mockInformation);

      await mediator.findInformation();

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle information with various field types', async () => {
      const mockInformation = [
        {
          id: 1,
          first_name: 'Test Information',
          last_name: 'Test Last Name',
          email: 'test@example.com',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
      ];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result = await mediator.findInformation();

      expect(result).toEqual(mockInformation);
      expect(result[0].id).toBe(1);
      expect(result[0].first_name).toBe('Test Information');
      expect(result[0].last_name).toBe('Test Last Name');
      expect(result[0].email).toBe('test@example.com');
      expect(result[0].created_at).toBeInstanceOf(Date);
      expect(result[0].updated_at).toBeInstanceOf(Date);
    });
  });

  describe('error handling', () => {
    it('should handle service errors gracefully', async () => {
      const errorMessage = 'Database connection failed';
      mockService.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(mediator.findInformation())
        .rejects.toThrow(errorMessage);

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle database timeout errors', async () => {
      const errorMessage = 'Database timeout';
      mockService.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(mediator.findInformation())
        .rejects.toThrow(errorMessage);

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle validation errors', async () => {
      const errorMessage = 'Invalid query parameters';
      mockService.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(mediator.findInformation())
        .rejects.toThrow(errorMessage);

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('catcher integration', () => {
    it('should use catcher for error handling', async () => {
      const errorMessage = 'Service error';
      mockService.findMany.mockRejectedValue(new Error(errorMessage));

      try {
        await mediator.findInformation();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
      }

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should preserve original error message through catcher', async () => {
      const errorMessage = 'Original error message';
      mockService.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(mediator.findInformation())
        .rejects.toThrow(errorMessage);

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('throwNotFound integration', () => {
    it('should not throw error when information is found', async () => {
      const mockInformation = [{ id: 1, first_name: 'Test Information' }];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result = await mediator.findInformation();

      expect(result).toEqual(mockInformation);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should throw error when service returns undefined', async () => {
      mockService.findMany.mockResolvedValue(undefined);

      await expect(mediator.findInformation())
        .rejects.toThrow('information Not Found');

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should throw error when service returns null', async () => {
      mockService.findMany.mockResolvedValue(null);

      await expect(mediator.findInformation())
        .rejects.toThrow('information Not Found');

      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('method behavior', () => {
    it('should be an arrow function', () => {
      expect(typeof mediator.findInformation).toBe('function');
      expect(mediator.findInformation).toBeInstanceOf(Function);
    });

    it('should be callable multiple times', async () => {
      const mockInformation = [{ id: 1, first_name: 'Test Information' }];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result1 = await mediator.findInformation();
      const result2 = await mediator.findInformation();

      expect(result1).toEqual(mockInformation);
      expect(result2).toEqual(mockInformation);
      expect(mockService.findMany).toHaveBeenCalledTimes(2);
    });

    it('should maintain consistent behavior across calls', async () => {
      const mockInformation = [{ id: 1, first_name: 'Test Information' }];
      mockService.findMany.mockResolvedValue(mockInformation);

      const result1 = await mediator.findInformation();
      const result2 = await mediator.findInformation();

      expect(result1).toEqual(result2);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });
});
