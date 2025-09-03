import { Test, TestingModule } from '@nestjs/testing';
import { MicrocampService } from '../microcamp.service';
import { MicrocampRepository } from '../microcamp.repository';
import { Microcamp } from '../../../core/data/database/entities/microcamp.entity';

// Mock the BaseService methods
jest.mock('../../../core/settings/base/service/base.service', () => ({
  BaseService: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    getQueryBuilder: jest.fn(),
  })),
}));

describe('MicrocampService', () => {
  let service: MicrocampService;
  let mockRepository: jest.Mocked<MicrocampRepository>;

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
        MicrocampService,
        {
          provide: MicrocampRepository,
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

    service = module.get<MicrocampService>(MicrocampService);
    mockRepository = module.get(MicrocampRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all microcamps', async () => {
      const mockMicrocamps = [mockMicrocamp];
      jest.spyOn(service, 'getAll').mockResolvedValue(mockMicrocamps);

      const result = await service.getAll();

      expect(result).toEqual(mockMicrocamps);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a microcamp by criteria', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockMicrocamp);

      const result = await service.findOne({ id: 1 });

      expect(result).toEqual(mockMicrocamp);
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when microcamp not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.findOne({ id: 999 });

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findMany', () => {
    it('should find multiple microcamps by criteria', async () => {
      const mockMicrocamps = [mockMicrocamp];
      jest.spyOn(service, 'findMany').mockResolvedValue(mockMicrocamps);

      const result = await service.findMany({ code: 'MC001' });

      expect(result).toEqual(mockMicrocamps);
      expect(service.findMany).toHaveBeenCalledWith({ code: 'MC001' });
    });
  });

  describe('findAndCount', () => {
    it('should find microcamps with count', async () => {
      const mockMicrocamps = [mockMicrocamp];
      const mockCount = 1;
      jest.spyOn(service, 'findAndCount').mockResolvedValue([mockMicrocamps, mockCount]);

      const result = await service.findAndCount({ code: 'MC001' });

      expect(result).toEqual([mockMicrocamps, mockCount]);
      expect(service.findAndCount).toHaveBeenCalledWith({ code: 'MC001' });
    });
  });

  describe('create', () => {
    it('should create a new microcamp', () => {
      const newMicrocamp = { code: 'MC002', name: 'New Microcamp' };
      jest.spyOn(service, 'create').mockReturnValue(mockMicrocamp);

      const result = service.create(newMicrocamp as any);

      expect(result).toEqual(mockMicrocamp);
      expect(service.create).toHaveBeenCalledWith(newMicrocamp);
    });
  });

  describe('update', () => {
    it('should update a microcamp', async () => {
      const updateData = { name: 'Updated Microcamp' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(service, 'update').mockResolvedValue(updateResult);

      const result = await service.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(service.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a microcamp', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await service.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(service.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a microcamp', async () => {
      jest.spyOn(service, 'save').mockResolvedValue(mockMicrocamp);

      const result = await service.save(mockMicrocamp as any);

      expect(result).toEqual(mockMicrocamp);
      expect(service.save).toHaveBeenCalledWith(mockMicrocamp);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = {} as any;
      jest.spyOn(service, 'getQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = service.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(service.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
