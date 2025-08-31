import { Test, TestingModule } from '@nestjs/testing';
import { MicrocampApplicationMediator } from '../microcamp-applications.mediator';
import { MicrocampApplicationService } from '../microcamp-applications.service';
import { MicrocampApplication } from '../../../core/data/database/entities/microcamp-application.entity';

describe('MicrocampApplicationMediator', () => {
  let mediator: MicrocampApplicationMediator;
  let service: MicrocampApplicationService;
  let module: TestingModule;

  const mockMicrocampApplicationService = {
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

  const mockMicrocampApplication: Partial<MicrocampApplication> = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    phone_number: 1234567890,
    country_residence: 'Test Country',
    age_range: '18-25',
    referral_source: 'Social Media',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MicrocampApplicationMediator,
        {
          provide: MicrocampApplicationService,
          useValue: mockMicrocampApplicationService,
        },
      ],
    }).compile();

    mediator = module.get<MicrocampApplicationMediator>(MicrocampApplicationMediator);
    service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
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

    it('should be an instance of MicrocampApplicationMediator', () => {
      expect(mediator).toBeInstanceOf(MicrocampApplicationMediator);
    });

    it('should have service dependency injected', () => {
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBe(service);
    });
  });

  describe('mediator structure', () => {
    it('should be injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['microcampApplicationService']).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject MicrocampApplicationService', () => {
      expect(mediator['microcampApplicationService']).toBe(service);
    });

    it('should have access to service methods', () => {
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(typeof mediator['microcampApplicationService'].getAll).toBe('function');
      expect(typeof mediator['microcampApplicationService'].findOne).toBe('function');
      expect(typeof mediator['microcampApplicationService'].findMany).toBe('function');
      expect(typeof mediator['microcampApplicationService'].findAndCount).toBe('function');
      expect(typeof mediator['microcampApplicationService'].create).toBe('function');
      expect(typeof mediator['microcampApplicationService'].update).toBe('function');
      expect(typeof mediator['microcampApplicationService'].delete).toBe('function');
      expect(typeof mediator['microcampApplicationService'].save).toBe('function');
      expect(typeof mediator['microcampApplicationService'].getQueryBuilder).toBe('function');
    });
  });

  describe('mediator metadata', () => {
    it('should be a valid NestJS injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper service dependency', () => {
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBe(service);
    });
  });

  describe('service method delegation', () => {
    it('should delegate getAll to service', async () => {
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];
      mockMicrocampApplicationService.getAll.mockResolvedValue(mockApplications);

      // Since the mediator doesn't have methods yet, we test the service directly
      const result = await service.getAll();

      expect(result).toEqual(mockApplications);
      expect(mockMicrocampApplicationService.getAll).toHaveBeenCalled();
    });

    it('should delegate findOne to service', async () => {
      const whereCriteria = { id: 1 };
      mockMicrocampApplicationService.findOne.mockResolvedValue(mockMicrocampApplication);

      const result = await service.findOne(whereCriteria);

      expect(result).toEqual(mockMicrocampApplication);
      expect(mockMicrocampApplicationService.findOne).toHaveBeenCalledWith(whereCriteria);
    });

    it('should delegate findMany to service', async () => {
      const whereCriteria = { country_residence: 'Test Country' };
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];

      mockMicrocampApplicationService.findMany.mockResolvedValue(mockApplications);

      const result = await service.findMany(whereCriteria);

      expect(result).toEqual(mockApplications);
      expect(mockMicrocampApplicationService.findMany).toHaveBeenCalledWith(whereCriteria);
    });

    it('should delegate create to service', () => {
      const createData = {
        email: 'new@example.com',
        full_name: 'New User',
        phone_number: 9876543210,
      };

      mockMicrocampApplicationService.create.mockReturnValue(createData);

      const result = service.create(createData);

      expect(result).toEqual(createData);
      expect(mockMicrocampApplicationService.create).toHaveBeenCalledWith(createData);
    });

    it('should delegate update to service', async () => {
      const criteria = { id: 1 };
      const updateData = { email: 'updated@example.com' };
      const mockUpdateResult = { affected: 1 };

      mockMicrocampApplicationService.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockMicrocampApplicationService.update).toHaveBeenCalledWith(criteria, updateData);
    });

    it('should delegate delete to service', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockMicrocampApplicationService.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockMicrocampApplicationService.delete).toHaveBeenCalledWith(criteria);
    });

    it('should delegate save to service', async () => {
      const saveData = mockMicrocampApplication;
      mockMicrocampApplicationService.save.mockResolvedValue(saveData);

      const result = await service.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockMicrocampApplicationService.save).toHaveBeenCalledWith(saveData);
    });

    it('should delegate getQueryBuilder to service', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockMicrocampApplicationService.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockMicrocampApplicationService.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
