import { Test, TestingModule } from '@nestjs/testing';
import { DecisionDateMediator } from '../decision-date.mediator';
import { DecisionDateService } from '../decision-date.service';
import { CreateEditDecisionDateDto } from '../dtos/create-dates.dto';
import { DecisionDates } from '../../../core/data/database/entities/decision-date.entity';
import { DecisionDateCycle } from '../../../core/data/database/relations/decisionDate-cycle.entity';

// Mock the DecisionDateCycle entity
jest.mock('../../../core/data/database/relations/decisionDate-cycle.entity', () => {
  return {
    DecisionDateCycle: jest.fn().mockImplementation(() => ({
      cycle_id: 1,
      decision_date_id: 1,
      save: jest.fn().mockResolvedValue({ id: 1, cycle_id: 1, decision_date_id: 1 }),
    })),
  };
});

describe('DecisionDateMediator', () => {
  let mediator: DecisionDateMediator;
  let service: DecisionDateService;

  const mockService = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDecisionDate: DecisionDates = {
    id: 1,
    date_time_1: new Date('2024-01-01T10:00:00Z'),
    link_1: 'https://example.com/link1',
    link_2: 'https://example.com/link2',
    link_3: 'https://example.com/link3',
    link_4: 'https://example.com/link4',
    date_1: new Date('2024-01-01'),
    date_2: new Date('2024-01-02'),
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  } as DecisionDates;

  const mockDecisionDateCycle: DecisionDateCycle = {
    id: 1,
    cycle_id: 1,
    decision_date_id: 1,
  } as DecisionDateCycle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionDateMediator,
        {
          provide: DecisionDateService,
          useValue: mockService,
        },
      ],
    }).compile();

    mediator = module.get<DecisionDateMediator>(DecisionDateMediator);
    service = module.get<DecisionDateService>(DecisionDateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of DecisionDateMediator', () => {
      expect(mediator).toBeInstanceOf(DecisionDateMediator);
    });

    it('should have service injected', () => {
      expect(service).toBeDefined();
    });

    it('should have all required methods', () => {
      expect(typeof mediator.createEditDates).toBe('function');
    });
  });

  describe('createEditDates - Create operation', () => {
    const createDto: CreateEditDecisionDateDto = {
      cycleId: 1,
      dateTime1: new Date('2024-01-01T10:00:00Z'),
      link1: 'https://example.com/link1',
      link2: 'https://example.com/link2',
      link3: 'https://example.com/link3',
      link4: 'https://example.com/link4',
      date1: new Date('2024-01-01'),
      date2: new Date('2024-01-02'),
    };

    it('should successfully create decision date', async () => {
      const createdDecisionDate = { ...mockDecisionDate };
      const savedDecisionDate = { ...createdDecisionDate, id: 1 };

      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockResolvedValue(savedDecisionDate);

      const result = await mediator.createEditDates(createDto);

      expect(result.message).toBe('Decision Date created successfully.');
      expect(result.decisionDate).toBeDefined();
      expect(mockService.create).toHaveBeenCalledWith({
        date_time_1: createDto.dateTime1,
        link_1: createDto.link1,
        link_4: createDto.link4,
        link_3: createDto.link3,
        link_2: createDto.link2,
        date_1: createDto.date1,
        date_2: createDto.date2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(mockService.save).toHaveBeenCalledTimes(1);
    });

    it('should handle minimal data (only cycleId)', async () => {
      const minimalDto: CreateEditDecisionDateDto = {
        cycleId: 1,
      };

      const createdDecisionDate = { ...mockDecisionDate, id: 1 };
      const savedDecisionDate = { ...createdDecisionDate };

      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockResolvedValue(savedDecisionDate);

      const result = await mediator.createEditDates(minimalDto);

      expect(result.message).toBe('Decision Date created successfully.');
      expect(result.decisionDate).toBeDefined();
      expect(mockService.create).toHaveBeenCalledWith({
        date_time_1: null,
        link_1: null,
        link_4: null,
        link_3: null,
        link_2: null,
        date_1: null,
        date_2: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should sanitize empty string links to null', async () => {
      const dtoWithEmptyLinks: CreateEditDecisionDateDto = {
        cycleId: 1,
        link1: '',
        link2: '   ',
        link3: '',
        link4: '',
      };

      const createdDecisionDate = { ...mockDecisionDate, id: 1 };
      const savedDecisionDate = { ...createdDecisionDate };

      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockResolvedValue(savedDecisionDate);

      const result = await mediator.createEditDates(dtoWithEmptyLinks);

      expect(result.message).toBe('Decision Date created successfully.');
      expect(mockService.create).toHaveBeenCalledWith({
        date_time_1: null,
        link_1: null,
        link_4: null,
        link_3: null,
        link_2: null,
        date_1: null,
        date_2: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle null dates correctly', async () => {
      const dtoWithNullDates: CreateEditDecisionDateDto = {
        cycleId: 1,
        dateTime1: null,
        date1: null,
        date2: null,
      };

      const createdDecisionDate = { ...mockDecisionDate, id: 1 };
      const savedDecisionDate = { ...createdDecisionDate };

      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockResolvedValue(savedDecisionDate);

      const result = await mediator.createEditDates(dtoWithNullDates);

      expect(result.message).toBe('Decision Date created successfully.');
      expect(mockService.create).toHaveBeenCalledWith({
        date_time_1: null,
        link_1: null,
        link_4: null,
        link_3: null,
        link_2: null,
        date_1: null,
        date_2: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('createEditDates - Edit operation', () => {
    const editDto: CreateEditDecisionDateDto = {
      cycleId: 1,
      decisionDateId: 123,
      dateTime1: new Date('2024-02-01T10:00:00Z'),
      link1: 'https://updated.com/link1',
      date1: new Date('2024-02-01'),
    };

    it('should successfully edit existing decision date', async () => {
      const existingDecisionDate = { ...mockDecisionDate, id: 123 };
      const updatedDecisionDate = { ...existingDecisionDate, updated_at: new Date() };

      mockService.findOne.mockResolvedValue(existingDecisionDate);
      mockService.save.mockResolvedValue(updatedDecisionDate);

      const result = await mediator.createEditDates(editDto);

      expect(result.message).toBe('Decision Date updated successfully.');
      expect(result.decisionDate).toBeDefined();
      expect(mockService.findOne).toHaveBeenCalledWith({ id: 123 });
      expect(mockService.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 123,
        date_time_1: new Date('2024-02-01T10:00:00Z'),
        link_1: 'https://updated.com/link1',
        date_1: new Date('2024-02-01'),
        updated_at: expect.any(Date),
      }));
    });

    it('should preserve existing values when not provided in update', async () => {
      const existingDecisionDate = {
        ...mockDecisionDate,
        id: 123,
        link_2: 'https://existing.com/link2',
        link_3: 'https://existing.com/link3',
        link_4: 'https://existing.com/link4',
        date_2: new Date('2024-01-02'),
      };
      const updatedDecisionDate = { ...existingDecisionDate, updated_at: new Date() };

      mockService.findOne.mockResolvedValue(existingDecisionDate);
      mockService.save.mockResolvedValue(updatedDecisionDate);

      const result = await mediator.createEditDates(editDto);

      expect(result.message).toBe('Decision Date updated successfully.');
      expect(mockService.save).toHaveBeenCalledWith(expect.objectContaining({
        link_2: 'https://existing.com/link2',
        link_3: 'https://existing.com/link3',
        link_4: 'https://existing.com/link4',
        date_2: new Date('2024-01-02'),
      }));
    });

    it('should throw error when decision date not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(mediator.createEditDates(editDto))
        .rejects.toThrow('Decision date with ID 123 not found');

      expect(mockService.findOne).toHaveBeenCalledWith({ id: 123 });
      expect(mockService.save).not.toHaveBeenCalled();
    });

    it('should update timestamps correctly', async () => {
      const existingDecisionDate = { ...mockDecisionDate, id: 123 };
      const updatedDecisionDate = { ...existingDecisionDate, updated_at: new Date() };

      mockService.findOne.mockResolvedValue(existingDecisionDate);
      mockService.save.mockResolvedValue(updatedDecisionDate);

      const result = await mediator.createEditDates(editDto);

      expect(result.message).toBe('Decision Date updated successfully.');
      expect(mockService.save).toHaveBeenCalledWith(expect.objectContaining({
        updated_at: expect.any(Date),
      }));
    });
  });

  describe('data transformation', () => {
    it('should convert snake_case to camelCase in response', async () => {
      const createDto: CreateEditDecisionDateDto = {
        cycleId: 1,
      };

      const createdDecisionDate = { ...mockDecisionDate, id: 1 };
      const savedDecisionDate = { ...createdDecisionDate };

      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockResolvedValue(savedDecisionDate);

      const result = await mediator.createEditDates(createDto);

      expect(result.decisionDate).toBeDefined();
      // The convertToCamelCase function should transform the response
      expect(result.decisionDate).toHaveProperty('decisionDateCycle');
    });
  });

  describe('error handling', () => {
    it('should handle service errors gracefully', async () => {
      const createDto: CreateEditDecisionDateDto = {
        cycleId: 1,
      };

      mockService.create.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await expect(mediator.createEditDates(createDto))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle save operation errors', async () => {
      const createDto: CreateEditDecisionDateDto = {
        cycleId: 1,
      };

      const createdDecisionDate = { ...mockDecisionDate, id: 1 };
      mockService.create.mockReturnValue(createdDecisionDate);
      mockService.save.mockRejectedValue(new Error('Save operation failed'));

      await expect(mediator.createEditDates(createDto))
        .rejects.toThrow('Save operation failed');
    });
  });
});
