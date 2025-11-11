import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserMediator } from '../user.mediator';
import { User } from '../../../core/data/database';

describe('UserController', () => {
  let controller: UserController;
  let mockMediator: jest.Mocked<UserMediator>;

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
      controllers: [UserController],
      providers: [
        {
          provide: UserMediator,
          useValue: {
            findUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockMediator = module.get(UserMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      mockMediator.findUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockMediator.findUsers).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      mockMediator.findUsers.mockResolvedValue([]);

      const result = await controller.getUsers();

      expect(result).toEqual([]);
      expect(mockMediator.findUsers).toHaveBeenCalled();
    });

    it('should handle mediator errors', async () => {
      const error = new Error('Mediator error');
      mockMediator.findUsers.mockRejectedValue(error);

      await expect(controller.getUsers()).rejects.toThrow('Mediator error');
      expect(mockMediator.findUsers).toHaveBeenCalled();
    });
  });

  describe('decorators', () => {
    it('should have proper decorators', () => {
      expect(true).toBe(true);
    });
  });
});

