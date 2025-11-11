import { Test, TestingModule } from '@nestjs/testing';
import { UserMediator } from '../user.mediator';
import { UserService } from '../user.service';
import { User } from '../../../core/data/database';

describe('UserMediator', () => {
  let mediator: UserMediator;
  let mockService: jest.Mocked<UserService>;

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
        UserMediator,
        {
          provide: UserService,
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

    mediator = module.get<UserMediator>(UserMediator);
    mockService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      mockService.findMany.mockResolvedValue(mockUsers);

      const result = await mediator.findUsers();

      expect(result).toEqual(mockUsers);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle empty result', async () => {
      mockService.findMany.mockResolvedValue([]);

      const result = await mediator.findUsers();

      expect(result).toEqual([]);
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockService.findMany.mockRejectedValue(error);

      await expect(mediator.findUsers()).rejects.toThrow('Service error');
      expect(mockService.findMany).toHaveBeenCalledWith({});
    });
  });
});

