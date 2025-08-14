import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRepository } from '../admin.repository';
import { Admin } from '../../../core/data/database';

describe('AdminRepository', () => {
  let repository: AdminRepository;
  let typeOrmRepository: Repository<Admin>;
  let module: TestingModule;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    findAndCount: jest.fn(),
    findMany: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AdminRepository,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<AdminRepository>(AdminRepository);
    typeOrmRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
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

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('should extend BaseRepository', () => {
      expect(repository).toBeInstanceOf(AdminRepository);
    });

    it('should have access to TypeORM repository', () => {
      expect(repository['repository']).toBeDefined();
      expect(repository['repository']).toBe(mockTypeOrmRepository);
    });
  });

  describe('inheritance', () => {
    it('should have BaseRepository methods available', () => {
      expect(typeof repository.findOne).toBe('function');
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.save).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
      expect(typeof repository.findAndCount).toBe('function');
      expect(typeof repository.findMany).toBe('function');
    });
  });

  describe('repository methods', () => {
    it('should call TypeORM repository findOne method', async () => {
      const mockAdmin = { id: 1, name: 'Test Admin', email: 'test@example.com' };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await repository.findOne({ where: { email: 'test@example.com' } });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockAdmin);
    });

    it('should call TypeORM repository create method', () => {
      const adminData = { name: 'New Admin', email: 'new@example.com' };
      const mockAdmin = { id: 1, ...adminData };
      mockTypeOrmRepository.create.mockReturnValue(mockAdmin);

      const result = repository.create(adminData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(adminData);
      expect(result).toEqual(mockAdmin);
    });

    it('should call TypeORM repository save method', async () => {
      const mockAdmin = { id: 1, name: 'Test Admin', email: 'test@example.com' };
      mockTypeOrmRepository.save.mockResolvedValue(mockAdmin);

      const result = await repository.save(mockAdmin);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual(mockAdmin);
    });

    it('should call TypeORM repository findAndCount method', async () => {
      const mockAdmins = [
        { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
        { id: 2, name: 'Admin 2', email: 'admin2@example.com' },
      ];
      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockAdmins, 2]);

      const result = await repository.findAndCount({});

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({});
      expect(result).toEqual([mockAdmins, 2]);
    });
  });
});

