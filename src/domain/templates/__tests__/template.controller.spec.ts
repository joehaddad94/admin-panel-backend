import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from '../template.controller';
import { TemplateMediator } from '../template.mediator';
import { GetTemplatesDto } from '../dtos/templateFilters.dto';
import { CreateEditTemplateDto } from '../dtos/createEditTemplate.dto';
import { DeleteTemplatesDto } from '../dtos/templateFilters.dto';
import { TestSendEmailTemplateDto } from '../dtos/testSendEmailTemplate.dto';

describe('TemplateController', () => {
  let controller: TemplateController;
  let mockMediator: jest.Mocked<TemplateMediator>;

  const mockTemplate = {
    id: 1,
    name: 'Test Template',
    subject: 'Test Subject',
    htmlContent: '<p>Test</p>',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateMediator,
          useValue: {
            findTemplates: jest.fn(),
            getTemplateById: jest.fn(),
            createEditTemplate: jest.fn(),
            deleteTemplates: jest.fn(),
            testSendEmailTemplate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    mockMediator = module.get(TemplateMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplates', () => {
    it('should return templates with filters', async () => {
      const filters: GetTemplatesDto = { search: 'test' };
      const mockResult = { templates: [mockTemplate], total: 1 };
      mockMediator.findTemplates.mockResolvedValue(mockResult);

      const result = await controller.getTemplates(filters);

      expect(result).toEqual(mockResult);
      expect(mockMediator.findTemplates).toHaveBeenCalledWith(filters);
    });

    it('should handle empty result', async () => {
      const filters: GetTemplatesDto = {};
      const mockResult = { templates: [], total: 0 };
      mockMediator.findTemplates.mockResolvedValue(mockResult);

      const result = await controller.getTemplates(filters);

      expect(result).toEqual(mockResult);
      expect(mockMediator.findTemplates).toHaveBeenCalledWith(filters);
    });
  });

  describe('getTemplateById', () => {
    it('should return a template by id', async () => {
      mockMediator.getTemplateById.mockResolvedValue(mockTemplate);

      const result = await controller.getTemplateById(1);

      expect(result).toEqual(mockTemplate);
      expect(mockMediator.getTemplateById).toHaveBeenCalledWith(1);
    });

    it('should handle mediator errors', async () => {
      const error = new Error('Template not found');
      mockMediator.getTemplateById.mockRejectedValue(error);

      await expect(controller.getTemplateById(999)).rejects.toThrow('Template not found');
      expect(mockMediator.getTemplateById).toHaveBeenCalledWith(999);
    });
  });

  describe('createEditTemplate', () => {
    it('should create a new template', async () => {
      const dto: CreateEditTemplateDto = {
        name: 'New Template',
        subject: 'New Subject',
        designJson: {},
        htmlContent: '<p>Content</p>',
        templateCategoryId: 1,
      };
      const mockResult = { message: 'Template created', template: mockTemplate };
      mockMediator.createEditTemplate.mockResolvedValue(mockResult);

      const result = await controller.createEditTemplate(dto);

      expect(result).toEqual(mockResult);
      expect(mockMediator.createEditTemplate).toHaveBeenCalledWith(dto);
    });

    it('should update an existing template', async () => {
      const dto: CreateEditTemplateDto = {
        templateId: 1,
        name: 'Updated Template',
        subject: 'Updated Subject',
        designJson: {},
        htmlContent: '<p>Updated</p>',
        templateCategoryId: 1,
      };
      const mockResult = { message: 'Template updated', template: mockTemplate };
      mockMediator.createEditTemplate.mockResolvedValue(mockResult);

      const result = await controller.createEditTemplate(dto);

      expect(result).toEqual(mockResult);
      expect(mockMediator.createEditTemplate).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteTemplates', () => {
    it('should delete templates', async () => {
      const dto: DeleteTemplatesDto = { templateIds: ['1', '2'] };
      const mockResult = { message: 'Template(s) successfully deleted', deletedIds: [1, 2] };
      mockMediator.deleteTemplates.mockResolvedValue(mockResult);

      const result = await controller.deleteTemplates(dto);

      expect(result).toEqual(mockResult);
      expect(mockMediator.deleteTemplates).toHaveBeenCalledWith(dto);
    });
  });

  describe('testSendEmailTemplate', () => {
    it('should send test email', async () => {
      const dto: TestSendEmailTemplateDto = {
        templateId: 1,
        emails: ['test@example.com'],
      };
      const mockResult = { success: true };
      mockMediator.testSendEmailTemplate.mockResolvedValue(mockResult);

      const result = await controller.testSendEmailTemplate(dto);

      expect(result).toEqual(mockResult);
      expect(mockMediator.testSendEmailTemplate).toHaveBeenCalledWith(dto);
    });
  });
});

