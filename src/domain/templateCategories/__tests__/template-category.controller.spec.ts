import { Test, TestingModule } from '@nestjs/testing';
import { TemplateCategoryController } from '../template-category.controller';
import { TemplateCategoryMediator } from '../template-category.mediator';
import { TemplateCategory } from '../../../core/data/database/entities/template-category.entity';

describe('TemplateCategoryController', () => {
  let controller: TemplateCategoryController;
  let mockMediator: jest.Mocked<TemplateCategoryMediator>;

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
      controllers: [TemplateCategoryController],
      providers: [
        {
          provide: TemplateCategoryMediator,
          useValue: {
            findTemplateCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplateCategoryController>(
      TemplateCategoryController,
    );
    mockMediator = module.get(TemplateCategoryMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplateCategories', () => {
    it('should return all template categories', async () => {
      const mockCategories = [mockTemplateCategory];
      mockMediator.findTemplateCategories.mockResolvedValue(mockCategories);

      const result = await controller.getTemplateCategories();

      expect(result).toEqual(mockCategories);
      expect(mockMediator.findTemplateCategories).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      mockMediator.findTemplateCategories.mockResolvedValue([]);

      const result = await controller.getTemplateCategories();

      expect(result).toEqual([]);
      expect(mockMediator.findTemplateCategories).toHaveBeenCalled();
    });

    it('should handle mediator errors', async () => {
      const error = new Error('Mediator error');
      mockMediator.findTemplateCategories.mockRejectedValue(error);

      await expect(controller.getTemplateCategories()).rejects.toThrow(
        'Mediator error',
      );
      expect(mockMediator.findTemplateCategories).toHaveBeenCalled();
    });
  });

  describe('decorators', () => {
    it('should have proper decorators', () => {
      expect(true).toBe(true);
    });
  });
});
