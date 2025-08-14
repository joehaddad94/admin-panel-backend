import { Test, TestingModule } from '@nestjs/testing';
import { AdminMediator } from '../admin.mediator';
import { AdminService } from '../admin.service';
import { MailService } from '../../mail/mail.service';
import { ManualCreateDto, InviteDto } from '../dto/index';
import { throwBadRequest } from '../../../core/settings/base/errors/errors';

// Mock the external dependencies
jest.mock('../../../core/settings/base/errors/errors', () => ({
  throwBadRequest: jest.fn((data) => {
    const error = new Error(data.message);
    error['status'] = 400;
    throw error;
  }),
}));

jest.mock('../../../core/helpers/operation', () => ({
  catcher: jest.fn((promise) => promise()),
}));

jest.mock('../../../core/helpers/camelCase', () => ({
  convertToCamelCase: jest.fn((data) => data),
}));

describe('AdminMediator', () => {
  let mediator: AdminMediator;
  let adminService: AdminService;
  let mailService: MailService;
  let module: TestingModule;

  const mockAdminService = {
    findOne: jest.fn(),
    create: jest.fn(),
    generateRandomPassword: jest.fn(),
    hashPassword: jest.fn(),
    generateLink: jest.fn(),
    findAndCount: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  };

  const mockMailService = {
    sendInvitationEmail: jest.fn(),
  };

  const mockAdmin = {
    id: 1,
    name: 'Test Admin',
    email: 'test@example.com',
    password: 'hashedPassword',
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    login_attempts: 5,
    reset_token: null,
    reset_token_expiry: null,
    created_by_id: 1,
    updated_by_id: 1,
    save: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AdminMediator,
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    mediator = module.get<AdminMediator>(AdminMediator);
    adminService = module.get<AdminService>(AdminService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    if (module) {
      await module.close();
    }
  });

  describe('manualCreate', () => {
    const createDto: ManualCreateDto = {
      name: 'New Admin',
      email: 'newadmin@example.com',
    };

    it('should create a new admin successfully', async () => {
      mockAdminService.findOne.mockResolvedValue(null);
      mockAdminService.generateRandomPassword.mockReturnValue('randomPass123');
      mockAdminService.hashPassword.mockResolvedValue('hashedPassword123');
      mockAdminService.create.mockReturnValue(mockAdmin);
      mockAdmin.save.mockResolvedValue(mockAdmin);

      const result = await mediator.manualCreate(createDto);

      expect(mockAdminService.findOne).toHaveBeenCalledWith({ email: createDto.email });
      expect(mockAdminService.generateRandomPassword).toHaveBeenCalled();
      expect(mockAdminService.hashPassword).toHaveBeenCalledWith('randomPass123');
      expect(mockAdminService.create).toHaveBeenCalledWith({
        name: createDto.name,
        email: createDto.email,
        password: 'hashedPassword123',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        is_active: true,
        login_attempts: 5,
      });
      expect(mockAdmin.save).toHaveBeenCalled();
      expect(result).toHaveProperty('adminData');
      expect(result).toHaveProperty('message', 'Admin added succesfully.');
    });

    it('should throw error when admin already exists', async () => {
      mockAdminService.findOne.mockResolvedValue(mockAdmin);

      await expect(mediator.manualCreate(createDto)).rejects.toThrow();

      expect(throwBadRequest).toHaveBeenCalledWith({
        message: 'Admin already exists with the provided email.',
        errorCheck: true,
      });
    });
  });

  describe('invite', () => {
    const inviteDto: InviteDto = {
      name: 'Test Admin',
      email: 'test@example.com',
    };

    it('should send invitation email successfully', async () => {
      const mockLink = 'https://example.com/verify?key=token&email=test@example.com';
      const mockResetToken = 'resetToken123';

      mockAdminService.findOne.mockResolvedValue(mockAdmin);
      mockAdminService.generateLink.mockResolvedValue({
        link: mockLink,
        reset_token: mockResetToken,
      });
      mockAdmin.save.mockResolvedValue(mockAdmin);
      mockMailService.sendInvitationEmail.mockResolvedValue(undefined);

      const result = await mediator.invite(inviteDto);

      expect(mockAdminService.findOne).toHaveBeenCalledWith({ email: inviteDto.email });
      expect(mockAdminService.generateLink).toHaveBeenCalledWith(inviteDto.email);
      expect(mockAdmin.reset_token).toBe(mockResetToken);
      expect(mockAdmin.reset_token_expiry).toBeInstanceOf(Date);
      expect(mockAdmin.save).toHaveBeenCalled();
      expect(mockMailService.sendInvitationEmail).toHaveBeenCalledWith(mockAdmin, 'invitation.hbs');
      expect(result).toEqual({ link: mockLink });
    });

    it('should throw error when admin does not exist', async () => {
      mockAdminService.findOne.mockResolvedValue(null);

      await expect(mediator.invite(inviteDto)).rejects.toThrow();

      expect(throwBadRequest).toHaveBeenCalledWith({
        message: 'Email does not exist',
        errorCheck: true,
      });
    });

    it('should set reset token expiry to 1 hour from now', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockAdminService.findOne.mockResolvedValue(mockAdmin);
      mockAdminService.generateLink.mockResolvedValue({
        link: 'https://example.com/verify',
        reset_token: 'token123',
      });
      mockAdmin.save.mockResolvedValue(mockAdmin);
      mockMailService.sendInvitationEmail.mockResolvedValue(undefined);

      await mediator.invite(inviteDto);

      const expectedExpiry = new Date(now + 3600000); // 1 hour in milliseconds
      expect(mockAdmin.reset_token_expiry).toEqual(expectedExpiry);
    });
  });

  describe('getAdmins', () => {
    it('should return admins with pagination', async () => {
      const mockAdmins = [
        { 
          id: 1, 
          name: 'Admin 1', 
          email: 'admin1@example.com',
          password: 'password',
          reset_token: 'token',
          reset_token_expiry: new Date(),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
          is_active: true,
          login_attempts: 5,
          created_by_id: 1,
          updated_by_id: 1,
        },
        { 
          id: 2, 
          name: 'Admin 2', 
          email: 'admin2@example.com',
          password: 'password',
          reset_token: 'token',
          reset_token_expiry: new Date(),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
          is_active: true,
          login_attempts: 5,
          created_by_id: 1,
          updated_by_id: 1,
        },
      ];

      mockAdminService.findAndCount.mockResolvedValue([mockAdmins, 2]);

      const result = await mediator.getAdmins(2, 10);

      expect(mockAdminService.findAndCount).toHaveBeenCalledWith({}, undefined, undefined, 10, 10);
      expect(result).toHaveProperty('admins');
      expect(result).toHaveProperty('total', 2);
      expect(result).toHaveProperty('page', 2);
      expect(result).toHaveProperty('pageSize', 10);
    });

    it('should return empty result when no admins found', async () => {
      mockAdminService.findAndCount.mockResolvedValue([[], 0]);

      const result = await mediator.getAdmins(1, 10);

      expect(result).toEqual({
        admins: [],
        total: 0,
        page: 1,
        pageSize: 10,
      });
    });

    it('should use default pagination values', async () => {
      mockAdminService.findAndCount.mockResolvedValue([[], 0]);

      await mediator.getAdmins();

      expect(mockAdminService.findAndCount).toHaveBeenCalledWith({}, undefined, undefined, 0, 10000000);
    });

    it('should format admin data correctly', async () => {
      const mockAdmins = [
        {
          id: 1,
          name: 'Admin 1',
          email: 'admin1@example.com',
          password: 'password',
          reset_token: 'token',
          reset_token_expiry: new Date(),
          created_at: new Date('2023-01-01'),
          is_active: true,
        },
      ];

      mockAdminService.findAndCount.mockResolvedValue([mockAdmins, 1]);

      const result = await mediator.getAdmins(1, 10);

      expect(result.admins[0]).not.toHaveProperty('password');
      expect(result.admins[0]).not.toHaveProperty('reset_token');
      expect(result.admins[0]).not.toHaveProperty('reset_token_expiry');
      expect(result.admins[0]).toHaveProperty('created_at');
      expect(result.admins[0]).toHaveProperty('is_active');
    });
  });

  describe('deleteAdmin', () => {
    it('should delete single admin successfully', async () => {
      const adminId = '1';
      mockAdminService.findMany.mockResolvedValue([mockAdmin]);
      mockAdminService.delete.mockResolvedValue(undefined);

      const result = await mediator.deleteAdmin(adminId);

      expect(mockAdminService.findMany).toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(mockAdminService.delete).toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(result).toEqual({
        message: 'Admin(s) successfully deleted.',
        deletedIds: [1],
      });
    });

    it('should delete multiple admins successfully', async () => {
      const adminIds = ['1', '2'];
      const mockAdmins = [
        { id: '1', name: 'Admin 1' },
        { id: '2', name: 'Admin 2' },
      ];

      mockAdminService.findMany.mockResolvedValue(mockAdmins);
      mockAdminService.delete.mockResolvedValue(undefined);

      const result = await mediator.deleteAdmin(adminIds);

      expect(mockAdminService.findMany).toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(mockAdminService.delete).toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(result).toEqual({
        message: 'Admin(s) successfully deleted.',
        deletedIds: ['1', '2'],
      });
    });

    it('should throw error when no admins found to delete', async () => {
      mockAdminService.findMany.mockResolvedValue([]);

      await expect(mediator.deleteAdmin('1')).rejects.toThrow();

      expect(throwBadRequest).toHaveBeenCalledWith({
        message: 'No admins with the provided ID(s) exist.',
        errorCheck: true,
      });
    });
  });
});

