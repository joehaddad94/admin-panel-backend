import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateRepository } from '../template.repository';
import { Templates } from '../../../core/data/database/entities/template.entity';

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

describe('TemplateRepository', () => {
  let repository: TemplateRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Templates>>;

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
        TemplateRepository,
        {
          provide: getRepositoryToken(Templates),
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

    repository = module.get<TemplateRepository>(TemplateRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Templates));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all templates', async () => {
      const mockTemplates = [mockTemplate];
      jest.spyOn(repository, 'getAll').mockResolvedValue(mockTemplates);

      const result = await repository.getAll();

      expect(result).toEqual(mockTemplates);
      expect(repository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a template by criteria', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTemplate);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockTemplate);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when template not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('findMany', () => {
    it('should find multiple templates by criteria', async () => {
      const mockTemplates = [mockTemplate];
      jest.spyOn(repository, 'findMany').mockResolvedValue(mockTemplates);

      const result = await repository.findMany({ where: { name: 'Test' } });

      expect(result).toEqual(mockTemplates);
      expect(repository.findMany).toHaveBeenCalledWith({ where: { name: 'Test' } });
    });
  });

  describe('findAndCount', () => {
    it('should find templates with count', async () => {
      const mockTemplates = [mockTemplate];
      const mockCount = 1;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockTemplates, mockCount]);

      const result = await repository.findAndCount({ where: { name: 'Test' } });

      expect(result).toEqual([mockTemplates, mockCount]);
      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { name: 'Test' } });
    });
  });

  describe('create', () => {
    it('should create a new template', () => {
      const newTemplate = { name: 'New Template', subject: 'New Subject' };
      jest.spyOn(repository, 'create').mockReturnValue(mockTemplate);

      const result = repository.create(newTemplate as any);

      expect(result).toEqual(mockTemplate);
      expect(repository.create).toHaveBeenCalledWith(newTemplate);
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const updateData = { name: 'Updated Template' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a template', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a template', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockTemplate);

      const result = await repository.save(mockTemplate as any);

      expect(result).toEqual(mockTemplate);
      expect(repository.save).toHaveBeenCalledWith(mockTemplate);
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

