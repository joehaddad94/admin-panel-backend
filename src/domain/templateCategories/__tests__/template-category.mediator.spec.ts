import { Test, TestingModule } from '@nestjs/testing';
import { TemplateCategoryMediator } from '../template-category.mediator';
import { TemplateCategoryService } from '../template-category.service';
import { TemplateCategory } from '../../../core/data/database/entities/template-category.entity';

describe('TemplateCategoryMediator', () => {
  let mediator: TemplateCategoryMediator;
  let mockService: jest.Mocked<TemplateCategoryService>;

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
        TemplateCategoryMediator,
        {
          provide: TemplateCategoryService,
          useValue: {
            findMany: jest.fn(),
            getAll: jest.fn(),
            findOne: jest.fn(),
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

    mediator = module.get<TemplateCategoryMediator>(TemplateCategoryMediator);
    mockService = module.get(TemplateCategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findTemplateCategories', () => {
    it('should return all template categories', async () => {
      const mockCategories = [mockTemplateCategory];
      mockService.findMany.mockResolvedValue(mockCategories);

      const result = await mediator.findTemplateCategories();

      expect(result).toEqual(mockCategories);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle empty result', async () => {
      mockService.findMany.mockResolvedValue([]);

      const result = await mediator.findTemplateCategories();

      expect(result).toEqual([]);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockService.findMany.mockRejectedValue(error);

      await expect(mediator.findTemplateCategories()).rejects.toThrow('Service error');
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });
});

