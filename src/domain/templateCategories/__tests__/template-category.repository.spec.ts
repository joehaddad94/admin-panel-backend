import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateCategoryRepository } from '../template-category.repository';
import { TemplateCategory } from '../../../core/data/database/entities/template-category.entity';

jest.mock('../../../core/settings/base/repository/base.repository', () => ({
  BaseRepository: jest.fn().mockImplementation(() => ({
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

describe('TemplateCategoryRepository', () => {
  let repository: TemplateCategoryRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<TemplateCategory>>;

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
        TemplateCategoryRepository,
        {
          provide: getRepositoryToken(TemplateCategory),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TemplateCategoryRepository>(TemplateCategoryRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(TemplateCategory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all template categories', async () => {
      const mockCategories = [mockTemplateCategory];
      jest.spyOn(repository, 'getAll').mockResolvedValue(mockCategories);

      const result = await repository.getAll();

      expect(result).toEqual(mockCategories);
      expect(repository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a template category by criteria', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTemplateCategory);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockTemplateCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when template category not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('findMany', () => {
    it('should find multiple template categories by criteria', async () => {
      const mockCategories = [mockTemplateCategory];
      jest.spyOn(repository, 'findMany').mockResolvedValue(mockCategories);

      const result = await repository.findMany({ where: { name: 'Screening' } });

      expect(result).toEqual(mockCategories);
      expect(repository.findMany).toHaveBeenCalledWith({ where: { name: 'Screening' } });
    });
  });

  describe('findAndCount', () => {
    it('should find template categories with count', async () => {
      const mockCategories = [mockTemplateCategory];
      const mockCount = 1;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockCategories, mockCount]);

      const result = await repository.findAndCount({ where: { name: 'Screening' } });

      expect(result).toEqual([mockCategories, mockCount]);
      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { name: 'Screening' } });
    });
  });

  describe('create', () => {
    it('should create a new template category', () => {
      const newCategory = { name: 'Interview' };
      jest.spyOn(repository, 'create').mockReturnValue(mockTemplateCategory);

      const result = repository.create(newCategory as any);

      expect(result).toEqual(mockTemplateCategory);
      expect(repository.create).toHaveBeenCalledWith(newCategory);
    });
  });

  describe('update', () => {
    it('should update a template category', async () => {
      const updateData = { name: 'Updated Category' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a template category', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a template category', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockTemplateCategory);

      const result = await repository.save(mockTemplateCategory as any);

      expect(result).toEqual(mockTemplateCategory);
      expect(repository.save).toHaveBeenCalledWith(mockTemplateCategory);
    });
  });

  describe('getQueryBuilder', () => {
    it('should return query builder', () => {
      const mockQueryBuilder = {} as any;
      jest.spyOn(repository, 'getQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = repository.getQueryBuilder();

      expect(result).toEqual(mockQueryBuilder);
      expect(repository.getQueryBuilder).toHaveBeenCalled();
    });
  });
});

