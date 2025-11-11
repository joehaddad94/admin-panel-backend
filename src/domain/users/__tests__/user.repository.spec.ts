import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../../../core/data/database';

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

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
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

    repository = module.get<UserRepository>(UserRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(repository, 'getAll').mockResolvedValue(mockUsers);

      const result = await repository.getAll();

      expect(result).toEqual(mockUsers);
      expect(repository.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a user by criteria', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await repository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('findMany', () => {
    it('should find multiple users by criteria', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(repository, 'findMany').mockResolvedValue(mockUsers);

      const result = await repository.findMany({ where: { email: 'test@example.com' } });

      expect(result).toEqual(mockUsers);
      expect(repository.findMany).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });
  });

  describe('findAndCount', () => {
    it('should find users with count', async () => {
      const mockUsers = [mockUser];
      const mockCount = 1;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockUsers, mockCount]);

      const result = await repository.findAndCount({ where: { email: 'test@example.com' } });

      expect(result).toEqual([mockUsers, mockCount]);
      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const newUser = { username: 'newuser', email: 'new@example.com' };
      jest.spyOn(repository, 'create').mockReturnValue(mockUser);

      const result = repository.create(newUser as any);

      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { email: 'updated@example.com' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

      const result = await repository.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      const result = await repository.save(mockUser as any);

      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
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

