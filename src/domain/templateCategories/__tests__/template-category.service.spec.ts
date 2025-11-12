import { Test, TestingModule } from '@nestjs/testing';
import { TemplateCategoryService } from '../template-category.service';
import { TemplateCategoryRepository } from '../template-category.repository';
import { TemplateCategory } from '../../../core/data/database/entities/template-category.entity';

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

describe('TemplateCategoryService', () => {
  let service: TemplateCategoryService;
  let mockRepository: jest.Mocked<TemplateCategoryRepository>;

  const mockTemplateCategory: TemplateCategory = {
    id: 1,
    name: 'Screening',
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
  } as TemplateCategory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateCategoryService,
        {
          provide: TemplateCategoryRepository,
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

    service = module.get<TemplateCategoryService>(TemplateCategoryService);
    mockRepository = module.get(TemplateCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all template categories', async () => {
      const mockCategories = [mockTemplateCategory];
      jest.spyOn(service, 'getAll').mockResolvedValue(mockCategories);

      const result = await service.getAll();

      expect(result).toEqual(mockCategories);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a template category by criteria', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTemplateCategory);

      const result = await service.findOne({ id: 1 });

      expect(result).toEqual(mockTemplateCategory);
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when template category not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.findOne({ id: 999 });

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findMany', () => {
    it('should find multiple template categories by criteria', async () => {
      const mockCategories = [mockTemplateCategory];
      jest.spyOn(service, 'findMany').mockResolvedValue(mockCategories);

      const result = await service.findMany({ name: 'Screening' });

      expect(result).toEqual(mockCategories);
      expect(service.findMany).toHaveBeenCalledWith({ name: 'Screening' });
    });
  });

  describe('findAndCount', () => {
    it('should find template categories with count', async () => {
      const mockCategories = [mockTemplateCategory];
      const mockCount = 1;
      jest.spyOn(service, 'findAndCount').mockResolvedValue([mockCategories, mockCount]);

      const result = await service.findAndCount({ name: 'Screening' });

      expect(result).toEqual([mockCategories, mockCount]);
      expect(service.findAndCount).toHaveBeenCalledWith({ name: 'Screening' });
    });
  });

  describe('create', () => {
    it('should create a new template category', () => {
      const newCategory = { name: 'Interview' };
      jest.spyOn(service, 'create').mockReturnValue(mockTemplateCategory);

      const result = service.create(newCategory as any);

      expect(result).toEqual(mockTemplateCategory);
      expect(service.create).toHaveBeenCalledWith(newCategory);
    });
  });

  describe('update', () => {
    it('should update a template category', async () => {
      const updateData = { name: 'Updated Category' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(service, 'update').mockResolvedValue(updateResult);

      const result = await service.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(service.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a template category', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await service.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(service.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a template category', async () => {
      jest.spyOn(service, 'save').mockResolvedValue(mockTemplateCategory);

      const result = await service.save(mockTemplateCategory as any);

      expect(result).toEqual(mockTemplateCategory);
      expect(service.save).toHaveBeenCalledWith(mockTemplateCategory);
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

