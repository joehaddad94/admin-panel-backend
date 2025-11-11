import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from '../template.service';
import { TemplateRepository } from '../template.repository';
import { Templates } from '../../../core/data/database/entities/template.entity';

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

describe('TemplateService', () => {
  let service: TemplateService;
  let mockRepository: jest.Mocked<TemplateRepository>;

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
  } as Templates;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: TemplateRepository,
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

    service = module.get<TemplateService>(TemplateService);
    mockRepository = module.get(TemplateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all templates', async () => {
      const mockTemplates = [mockTemplate];
      jest.spyOn(service, 'getAll').mockResolvedValue(mockTemplates);

      const result = await service.getAll();

      expect(result).toEqual(mockTemplates);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a template by criteria', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTemplate);

      const result = await service.findOne({ id: 1 });

      expect(result).toEqual(mockTemplate);
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when template not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.findOne({ id: 999 });

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findMany', () => {
    it('should find multiple templates by criteria', async () => {
      const mockTemplates = [mockTemplate];
      jest.spyOn(service, 'findMany').mockResolvedValue(mockTemplates);

      const result = await service.findMany({ name: 'Test' });

      expect(result).toEqual(mockTemplates);
      expect(service.findMany).toHaveBeenCalledWith({ name: 'Test' });
    });
  });

  describe('findAndCount', () => {
    it('should find templates with count', async () => {
      const mockTemplates = [mockTemplate];
      const mockCount = 1;
      jest.spyOn(service, 'findAndCount').mockResolvedValue([mockTemplates, mockCount]);

      const result = await service.findAndCount({ name: 'Test' });

      expect(result).toEqual([mockTemplates, mockCount]);
      expect(service.findAndCount).toHaveBeenCalledWith({ name: 'Test' });
    });
  });

  describe('create', () => {
    it('should create a new template', () => {
      const newTemplate = { name: 'New Template', subject: 'New Subject' };
      jest.spyOn(service, 'create').mockReturnValue(mockTemplate);

      const result = service.create(newTemplate as any);

      expect(result).toEqual(mockTemplate);
      expect(service.create).toHaveBeenCalledWith(newTemplate);
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const updateData = { name: 'Updated Template' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(service, 'update').mockResolvedValue(updateResult);

      const result = await service.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(service.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a template', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await service.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(service.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a template', async () => {
      jest.spyOn(service, 'save').mockResolvedValue(mockTemplate);

      const result = await service.save(mockTemplate as any);

      expect(result).toEqual(mockTemplate);
      expect(service.save).toHaveBeenCalledWith(mockTemplate);
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

