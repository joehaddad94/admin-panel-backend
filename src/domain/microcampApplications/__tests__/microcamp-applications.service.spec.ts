import { Test, TestingModule } from '@nestjs/testing';
import { MicrocampApplicationService } from '../microcamp-applications.service';
import { MicrocampApplicationRepository } from '../microcamp-applications.repository';
import { MicrocampApplication } from '../../../core/data/database/entities/microcamp-application.entity';
import { GlobalEntities } from '../../../core/data/types';

describe('MicrocampApplicationService', () => {
  let service: MicrocampApplicationService;
  let repository: MicrocampApplicationRepository;
  let module: TestingModule;

  const mockMicrocampApplicationRepository = {
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
        MicrocampApplicationService,
        {
          provide: MicrocampApplicationRepository,
          useValue: mockMicrocampApplicationRepository,
        },
      ],
    }).compile();

    service = module.get<MicrocampApplicationService>(MicrocampApplicationService);
    repository = module.get<MicrocampApplicationRepository>(MicrocampApplicationRepository);
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

  describe('service instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of MicrocampApplicationService', () => {
      expect(service).toBeInstanceOf(MicrocampApplicationService);
    });

    it('should have repository dependency injected', () => {
      expect(service['microcampApplicationRepository']).toBeDefined();
      expect(service['microcampApplicationRepository']).toBe(repository);
    });

    it('should have all required methods from BaseService', () => {
      expect(typeof service.getAll).toBe('function');
      expect(typeof service.findOne).toBe('function');
      expect(typeof service.findMany).toBe('function');
      expect(typeof service.findAndCount).toBe('function');
      expect(typeof service.create).toBe('function');
      expect(typeof service.update).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.save).toBe('function');
      expect(typeof service.getQueryBuilder).toBe('function');
    });
  });

  describe('getAll', () => {
    it('should return all microcamp applications', async () => {
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];
      mockMicrocampApplicationRepository.getAll.mockResolvedValue(mockApplications);

      const result = await service.getAll();

      expect(result).toEqual(mockApplications);
      expect(mockMicrocampApplicationRepository.getAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockMicrocampApplicationRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(mockMicrocampApplicationRepository.getAll).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockMicrocampApplicationRepository.getAll.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow('Database error');
      expect(mockMicrocampApplicationRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one microcamp application by criteria', async () => {
      const whereCriteria = { id: 1 };
      const relations: GlobalEntities[] = ['applicationMicrocamp'];
      const selects = { id: true, email: true, full_name: true };

      mockMicrocampApplicationRepository.findOne.mockResolvedValue(mockMicrocampApplication);

      const result = await service.findOne(whereCriteria, relations, selects);

      expect(result).toEqual(mockMicrocampApplication);
      expect(mockMicrocampApplicationRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          relations,
          select: selects,
        })
      );
    });

    it('should return null when no application found', async () => {
      const whereCriteria = { id: 999 };
      mockMicrocampApplicationRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(whereCriteria);

      expect(result).toBeNull();
      expect(mockMicrocampApplicationRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('should find multiple microcamp applications', async () => {
      const whereCriteria = { country_residence: 'Test Country' };
      const mockApplications = [mockMicrocampApplication, mockMicrocampApplication];

      mockMicrocampApplicationRepository.findMany.mockResolvedValue(mockApplications);

      const result = await service.findMany(whereCriteria);

      expect(result).toEqual(mockApplications);
      expect(mockMicrocampApplicationRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
        })
      );
    });
  });

  describe('findAndCount', () => {
    it('should find applications with count and pagination', async () => {
      const whereCriteria = { age_range: '18-25' };
      const mockApplications = [mockMicrocampApplication];
      const mockResult: [Partial<MicrocampApplication>[], number] = [mockApplications, 1];

      mockMicrocampApplicationRepository.findAndCount.mockResolvedValue(mockResult);

      const result = await service.findAndCount(whereCriteria, [], { id: true, email: true }, 0, 10);

      expect(result).toEqual(mockResult);
      expect(mockMicrocampApplicationRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCriteria,
          skip: 0,
          take: 10,
        })
      );
    });
  });

  describe('create', () => {
    it('should create a new microcamp application', () => {
      const createData = {
        email: 'new@example.com',
        full_name: 'New User',
        phone_number: 9876543210,
      };

      mockMicrocampApplicationRepository.create.mockReturnValue(createData);

      const result = service.create(createData);

      expect(result).toEqual(createData);
      expect(mockMicrocampApplicationRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a microcamp application', async () => {
      const criteria = { id: 1 };
      const updateData = { email: 'updated@example.com' };
      const mockUpdateResult = { affected: 1 };

      mockMicrocampApplicationRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(criteria, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockMicrocampApplicationRepository.update).toHaveBeenCalledWith(criteria, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a microcamp application', async () => {
      const criteria = { id: 1 };
      const mockDeleteResult = { affected: 1 };

      mockMicrocampApplicationRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.delete(criteria);

      expect(result).toEqual(mockDeleteResult);
      expect(mockMicrocampApplicationRepository.delete).toHaveBeenCalledWith(criteria);
    });
  });

  describe('save', () => {
    it('should save a single microcamp application', async () => {
      const saveData = mockMicrocampApplication;
      mockMicrocampApplicationRepository.save.mockResolvedValue(saveData);

      const result = await service.save(saveData);

      expect(result).toEqual(saveData);
      expect(mockMicrocampApplicationRepository.save).toHaveBeenCalledWith(saveData);
    });

    it('should save multiple microcamp applications', async () => {
      const saveData = [mockMicrocampApplication, mockMicrocampApplication];
      mockMicrocampApplicationRepository.save.mockResolvedValue(saveData);

      const result = await service.save(...saveData);

      expect(result).toEqual(saveData);
      expect(mockMicrocampApplicationRepository.save).toHaveBeenCalledWith(...saveData);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = { select: jest.fn() };
      mockMicrocampApplicationRepository.getQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(mockMicrocampApplicationRepository.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
