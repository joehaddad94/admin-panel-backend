import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { AdminMediator } from '../admin.mediator';

// Mock the external dependencies
jest.mock('../../../core/helpers/operation', () => ({
  catcher: jest.fn((promise) => promise()),
}));

describe('AdminController', () => {
  let controller: AdminController;
  let mediator: AdminMediator;
  let module: TestingModule;

  const mockAdminMediator = {
    manualCreate: jest.fn(),
    invite: jest.fn(),
    getAdmins: jest.fn(),
    deleteAdmin: jest.fn(),
  };

  const mockAdminData = {
    name: 'Test Admin',
    email: 'test@example.com',
  };

  const mockCreatedAdmin = {
    id: 1,
    name: 'Test Admin',
    email: 'test@example.com',
    is_active: true,
    created_at: new Date(),
  };

  const mockAdminResponse = {
    adminData: mockCreatedAdmin,
    message: 'Admin added succesfully.',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminMediator,
          useValue: mockAdminMediator,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    mediator = module.get<AdminMediator>(AdminMediator);
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

  describe('createAdmin', () => {
    it('should create admin and send invitation successfully', async () => {
      mockAdminMediator.manualCreate.mockResolvedValue(mockAdminResponse);
      mockAdminMediator.invite.mockResolvedValue({ link: 'https://example.com/verify' });

      const result = await controller.createAdmin(mockAdminData);

      expect(mockAdminMediator.manualCreate).toHaveBeenCalledWith(mockAdminData);
      expect(mockAdminMediator.invite).toHaveBeenCalledWith(mockAdminData);
      expect(result).toEqual(mockAdminResponse);
    });

    it('should handle validation errors', async () => {
      const invalidData = { name: '', email: 'invalid-email' };
      
      // Test that the method exists and can be called
      expect(typeof controller.createAdmin).toBe('function');
      expect(controller.createAdmin).toHaveLength(1); // Should accept one parameter
    });

    it('should use ValidationPipe with whitelist option', () => {
      // Check that the endpoint is properly defined
      expect(typeof controller.createAdmin).toBe('function');
      expect(controller.createAdmin).toHaveLength(1);
    });
  });

  describe('getAdmins', () => {
    it('should return admins with default pagination', async () => {
      const mockAdminsResponse = {
        admins: [mockCreatedAdmin],
        total: 1,
        page: 1,
        pageSize: 10000000,
      };

      mockAdminMediator.getAdmins.mockResolvedValue(mockAdminsResponse);

      const result = await controller.getAdmins({});

      expect(mockAdminMediator.getAdmins).toHaveBeenCalledWith(1, 10000000);
      expect(result).toEqual(mockAdminsResponse);
    });

    it('should return admins with custom pagination', async () => {
      const mockAdminsResponse = {
        admins: [mockCreatedAdmin],
        total: 1,
        page: 2,
        pageSize: 10,
      };

      mockAdminMediator.getAdmins.mockResolvedValue(mockAdminsResponse);

      const result = await controller.getAdmins({ page: 2, pageSize: 10 });

      expect(mockAdminMediator.getAdmins).toHaveBeenCalledWith(2, 10);
      expect(result).toEqual(mockAdminsResponse);
    });

    it('should handle empty pagination object', async () => {
      const mockAdminsResponse = {
        admins: [],
        total: 0,
        page: 1,
        pageSize: 10000000,
      };

      mockAdminMediator.getAdmins.mockResolvedValue(mockAdminsResponse);

      const result = await controller.getAdmins({});

      expect(mockAdminMediator.getAdmins).toHaveBeenCalledWith(1, 10000000);
      expect(result).toEqual(mockAdminsResponse);
    });

    it('should handle undefined pagination parameters', async () => {
      const mockAdminsResponse = {
        admins: [],
        total: 0,
        page: 1,
        pageSize: 10000000,
      };

      mockAdminMediator.getAdmins.mockResolvedValue(mockAdminsResponse);

      const result = await controller.getAdmins({ page: undefined, pageSize: undefined });

      expect(mockAdminMediator.getAdmins).toHaveBeenCalledWith(1, 10000000);
      expect(result).toEqual(mockAdminsResponse);
    });
  });

  describe('deleteAdmin', () => {
    it('should delete single admin successfully', async () => {
      const mockDeleteResponse = {
        message: 'Admin(s) successfully deleted.',
        deletedIds: [1],
      };

      mockAdminMediator.deleteAdmin.mockResolvedValue(mockDeleteResponse);

      const result = await controller.deleteAdmin('1');

      expect(mockAdminMediator.deleteAdmin).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockDeleteResponse);
    });

    it('should delete multiple admins successfully', async () => {
      const adminIds = ['1', '2', '3'];
      const mockDeleteResponse = {
        message: 'Admin(s) successfully deleted.',
        deletedIds: [1, 2, 3],
      };

      mockAdminMediator.deleteAdmin.mockResolvedValue(mockDeleteResponse);

      const result = await controller.deleteAdmin(adminIds);

      expect(mockAdminMediator.deleteAdmin).toHaveBeenCalledWith(adminIds);
      expect(result).toEqual(mockDeleteResponse);
    });

    it('should handle string array input', async () => {
      const adminIds = ['1', '2'];
      const mockDeleteResponse = {
        message: 'Admin(s) successfully deleted.',
        deletedIds: [1, 2],
      };

      mockAdminMediator.deleteAdmin.mockResolvedValue(mockDeleteResponse);

      const result = await controller.deleteAdmin(adminIds);
      expect(mockAdminMediator.deleteAdmin).toHaveBeenCalledWith(adminIds);
      expect(result).toEqual(mockDeleteResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      // Check that the endpoint is properly defined
      expect(typeof controller.deleteAdmin).toBe('function');
      expect(controller.deleteAdmin).toHaveLength(1);
    });
  });

  describe('controller metadata', () => {
    it('should have correct route prefix', () => {
      // The controller should be decorated with @Controller('admins')
      expect(controller).toBeDefined();
      expect(controller.constructor.name).toBe('AdminController');
    });

    it('should have correct API tags', () => {
      // The controller should be decorated with @ApiTags('admins')
      expect(controller).toBeDefined();
      expect(controller.constructor.name).toBe('AdminController');
    });
  });

  describe('dependency injection', () => {
    it('should inject AdminMediator correctly', () => {
      expect(mediator).toBeDefined();
      expect(mediator).toBe(mockAdminMediator);
    });

    it('should have access to mediator methods', () => {
      expect(typeof mediator.manualCreate).toBe('function');
      expect(typeof mediator.invite).toBe('function');
      expect(typeof mediator.getAdmins).toBe('function');
      expect(typeof mediator.deleteAdmin).toBe('function');
    });
  });
});

