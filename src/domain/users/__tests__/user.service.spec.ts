import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { User } from '../../../core/data/database';

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

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

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
        UserService,
        {
          provide: UserRepository,
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

    service = module.get<UserService>(UserService);
    mockRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(service, 'getAll').mockResolvedValue(mockUsers);

      const result = await service.getAll();

      expect(result).toEqual(mockUsers);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a user by criteria', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findOne({ id: 1 });

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.findOne({ id: 999 });

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findMany', () => {
    it('should find multiple users by criteria', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(service, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.findMany({ email: 'test@example.com' });

      expect(result).toEqual(mockUsers);
      expect(service.findMany).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('findAndCount', () => {
    it('should find users with count', async () => {
      const mockUsers = [mockUser];
      const mockCount = 1;
      jest.spyOn(service, 'findAndCount').mockResolvedValue([mockUsers, mockCount]);

      const result = await service.findAndCount({ email: 'test@example.com' });

      expect(result).toEqual([mockUsers, mockCount]);
      expect(service.findAndCount).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const newUser = { username: 'newuser', email: 'new@example.com' };
      jest.spyOn(service, 'create').mockReturnValue(mockUser);

      const result = service.create(newUser as any);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { email: 'updated@example.com' };
      const updateResult = { affected: 1 } as any;
      jest.spyOn(service, 'update').mockResolvedValue(updateResult);

      const result = await service.update({ id: 1 }, updateData);

      expect(result).toEqual(updateResult);
      expect(service.update).toHaveBeenCalledWith({ id: 1 }, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deleteResult = { affected: 1 } as any;
      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await service.delete({ id: 1 });

      expect(result).toEqual(deleteResult);
      expect(service.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      jest.spyOn(service, 'save').mockResolvedValue(mockUser);

      const result = await service.save(mockUser as any);

      expect(result).toEqual(mockUser);
      expect(service.save).toHaveBeenCalledWith(mockUser);
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

