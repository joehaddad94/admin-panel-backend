import { Test, TestingModule } from '@nestjs/testing';
import { TemplateMediator } from '../template.mediator';
import { TemplateService } from '../template.service';
import { MailService } from '../../mail/mail.service';
import { ProgramService } from '../../programs/program.service';
import { DataSource } from 'typeorm';
import { Templates } from '../../../core/data/database/entities/template.entity';
import { GetTemplatesDto } from '../dtos/templateFilters.dto';
import { CreateEditTemplateDto } from '../dtos/createEditTemplate.dto';
import { DeleteTemplatesDto } from '../dtos/templateFilters.dto';
import { TestSendEmailTemplateDto } from '../dtos/testSendEmailTemplate.dto';

describe('TemplateMediator', () => {
  let mediator: TemplateMediator;
  let mockTemplateService: jest.Mocked<TemplateService>;
  let mockMailService: jest.Mocked<MailService>;
  let mockProgramService: jest.Mocked<ProgramService>;
  let mockDataSource: jest.Mocked<DataSource>;

  const mockTemplate: Templates = {
    id: 1,
    name: 'Test Template',
    subject: 'Test Subject',
    design_json: {},
    html_content: '<p>Test</p>',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
    templateAdmin: [],
    templateProgram: [],
    templateCategoryLink: null,
  } as Templates;

  const mockEntityManager = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateMediator,
        {
          provide: TemplateService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            getQueryBuilder: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendTestEmailWithTemplate: jest.fn(),
          },
        },
        {
          provide: ProgramService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn((callback) => callback(mockEntityManager)),
          },
        },
      ],
    }).compile();

    mediator = module.get<TemplateMediator>(TemplateMediator);
    mockTemplateService = module.get(TemplateService);
    mockMailService = module.get(MailService);
    mockProgramService = module.get(ProgramService);
    mockDataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findTemplates', () => {
    it('should return templates with filters', async () => {
      const filters: GetTemplatesDto = { search: 'test' };
      const mockTemplates = [mockTemplate];
      mockTemplateService.findAndCount.mockResolvedValue([mockTemplates, 1]);

      const result = await mediator.findTemplates(filters);

      expect(result).toHaveProperty('templates');
      expect(result).toHaveProperty('total');
      expect(mockTemplateService.findAndCount).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      const filters: GetTemplatesDto = {};
      mockTemplateService.findAndCount.mockResolvedValue([[], 0]);

      const result = await mediator.findTemplates(filters);

      expect(result.templates).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getTemplateById', () => {
    it('should return a template by id', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);

      const result = await mediator.getTemplateById(1);

      expect(result).toBeDefined();
      expect(mockTemplateService.findOne).toHaveBeenCalledWith({ id: 1 }, ['templateAdmin']);
    });

    it('should handle template not found', async () => {
      mockTemplateService.findOne.mockResolvedValue(null);

      await expect(mediator.getTemplateById(999)).rejects.toThrow();
      expect(mockTemplateService.findOne).toHaveBeenCalledWith({ id: 999 }, ['templateAdmin']);
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

      const createdTemplate = { ...mockTemplate, id: 1 };
      const savedTemplate = { ...createdTemplate, id: 1 };
      const savedTemplateWithRelations = { 
        ...savedTemplate, 
        templateAdmin: [], 
        templateProgram: [],
        templateCategoryLink: null,
      };
      
      // Mock findOne calls:
      // 1. Check for existing template by name (should be null)
      // 2. Check for existing template category link in upsertTemplateCategoryLink (can be null)
      // 3. Load template with relations after save (should return template)
      mockEntityManager.findOne
        .mockResolvedValueOnce(null) // Check for existing template by name
        .mockResolvedValueOnce(null) // Check for existing template category link
        .mockResolvedValueOnce(savedTemplateWithRelations); // Load template with relations after save
      mockEntityManager.create.mockReturnValue(createdTemplate);
      mockEntityManager.save.mockResolvedValue(savedTemplate);

      const result = await mediator.createEditTemplate(dto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('template');
      expect(mockDataSource.transaction).toHaveBeenCalled();
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

      mockEntityManager.findOne.mockResolvedValue(mockTemplate);
      mockEntityManager.save.mockResolvedValue(mockTemplate);

      const result = await mediator.createEditTemplate(dto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('template');
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('deleteTemplates', () => {
    it('should delete templates', async () => {
      const dto: DeleteTemplatesDto = { templateIds: ['1', '2'] };
      const mockTemplates = [mockTemplate];
      mockTemplateService.findMany.mockResolvedValue(mockTemplates);
      mockTemplateService.delete.mockResolvedValue({ affected: 2 } as any);

      const result = await mediator.deleteTemplates(dto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('deletedIds');
      expect(mockTemplateService.findMany).toHaveBeenCalled();
      expect(mockTemplateService.delete).toHaveBeenCalled();
    });
  });

  describe('testSendEmailTemplate', () => {
    it('should send test email', async () => {
      const dto: TestSendEmailTemplateDto = {
        templateId: 1,
        emails: ['test@example.com'],
      };

      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockMailService.sendTestEmailWithTemplate.mockResolvedValue({ success: true } as any);

      const result = await mediator.testSendEmailTemplate(dto);

      expect(result).toBeDefined();
      expect(mockTemplateService.findOne).toHaveBeenCalledWith({ id: 1 }, ['templateAdmin']);
      expect(mockMailService.sendTestEmailWithTemplate).toHaveBeenCalled();
    });

    it('should handle template not found', async () => {
      const dto: TestSendEmailTemplateDto = {
        templateId: 999,
        emails: ['test@example.com'],
      };

      mockTemplateService.findOne.mockResolvedValue(null);

      await expect(mediator.testSendEmailTemplate(dto)).rejects.toThrow();
      expect(mockTemplateService.findOne).toHaveBeenCalled();
    });
  });
});

