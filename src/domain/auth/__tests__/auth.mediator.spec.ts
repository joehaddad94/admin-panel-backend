import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthMediator } from '../AuthMediator';
import { AuthService } from '../auth.service';
import { MailService } from '../../mail/mail.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { VerifyTokenDto } from '../dto/verifyToken.dto';

// Mock the external dependencies
jest.mock('../../../core/helpers/operation', () => ({
  catcher: jest.fn((promise) => promise()),
}));

jest.mock('../../../core/settings/base/errors/errors', () => ({
  throwBadRequest: jest.fn(({ message, errorCheck }) => {
    if (errorCheck) {
      throw new Error(message);
    }
  }),
}));

describe('AuthMediator', () => {
  let mediator: AuthMediator;
  let authService: AuthService;
  let mailService: MailService;
  let jwtService: JwtService;
  let module: TestingModule;

  const mockAuthService = {
    verifyEmail: jest.fn(),
    findOne: jest.fn(),
    comparePassword: jest.fn(),
    recordFailedLoginAttempt: jest.fn(),
    decrementLoginAttempts: jest.fn(),
    resetLoginAttempts: jest.fn(),
    generateToken: jest.fn(),
    generateResetToken: jest.fn(),
    findOneByResetToken: jest.fn(),
    updatePassword: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockMailService = {
    sendInvitationEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockAdmin = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test Admin',
    login_attempts: 5,
    is_active: true,
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockChangePasswordDto: ChangePasswordDto = {
    email: 'test@example.com',
    newPassword: 'newpassword123',
  };

  const mockVerifyTokenDto: VerifyTokenDto = {
    token: 'valid-jwt-token',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthMediator,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    mediator = module.get<AuthMediator>(AuthMediator);
    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
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

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(mockAdmin);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.resetLoginAttempts.mockResolvedValue(undefined);
      mockAuthService.generateToken.mockResolvedValue('jwt-token-here');

      const result = await mediator.login(mockLoginDto);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(mockAuthService.findOne).toHaveBeenCalledWith(
        { email: mockLoginDto.email },
        undefined,
        {
          id: true,
          email: true,
          password: true,
          name: true,
          login_attempts: true,
          is_active: true,
        }
      );
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockAdmin.password
      );
      expect(mockAuthService.resetLoginAttempts).toHaveBeenCalledWith(mockAdmin);
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockAdmin);

      expect(result).toEqual({
        name: mockAdmin.name,
        email: mockAdmin.email,
        token: 'jwt-token-here',
      });
    });

    it('should reject invalid email format', async () => {
      mockAuthService.verifyEmail.mockReturnValue(false);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow('Invalid email format');
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(mockLoginDto.email);
    });

    it('should reject when admin not found', async () => {
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(null);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow('Admin not found');
    });

    it('should reject when account is locked', async () => {
      const lockedAdmin = { ...mockAdmin, is_active: false };
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(lockedAdmin);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow('Account is locked');
    });

    it('should reject when login attempts are exhausted', async () => {
      const exhaustedAdmin = { ...mockAdmin, login_attempts: 0 };
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(exhaustedAdmin);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow(
        'Account locked due to multiple failed login attempts'
      );
    });

    it('should handle invalid password and record failed attempt', async () => {
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(mockAdmin);
      mockAuthService.comparePassword.mockResolvedValue(false);
      mockAuthService.recordFailedLoginAttempt.mockReturnValue(3);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow('Invalid Credentials');
      expect(mockAuthService.recordFailedLoginAttempt).toHaveBeenCalledWith(mockLoginDto.email);
    });

    it('should lock account after 5 failed attempts', async () => {
      mockAuthService.verifyEmail.mockReturnValue(true);
      mockAuthService.findOne.mockResolvedValue(mockAdmin);
      mockAuthService.comparePassword.mockResolvedValue(false);
      mockAuthService.recordFailedLoginAttempt.mockReturnValue(5);
      mockAuthService.decrementLoginAttempts.mockResolvedValue(true);

      await expect(mediator.login(mockLoginDto)).rejects.toThrow(
        'Account locked due to multiple failed login attempts'
      );
      expect(mockAuthService.decrementLoginAttempts).toHaveBeenCalledWith(mockAdmin);
    });
  });

  describe('changePassword', () => {
    it('should change password with email and new password', async () => {
      mockAuthService.findOneByResetToken.mockResolvedValue(mockAdmin);
      mockAuthService.updatePassword.mockResolvedValue(undefined);

      const result = await mediator.changePassword(mockChangePasswordDto);

      expect(mockAuthService.updatePassword).toHaveBeenCalledWith(
        mockAdmin,
        mockChangePasswordDto.newPassword
      );
      expect(result).toBeDefined();
    });

    it('should change password with reset token and new password', async () => {
      const resetTokenDto = {
        reset_token: 'valid-reset-token',
        newPassword: 'newpassword123',
      };
      mockAuthService.findOneByResetToken.mockResolvedValue(mockAdmin);
      mockAuthService.updatePassword.mockResolvedValue(undefined);

      const result = await mediator.changePassword(resetTokenDto);

      expect(mockAuthService.findOneByResetToken).toHaveBeenCalledWith(resetTokenDto.reset_token);
      expect(mockAuthService.updatePassword).toHaveBeenCalledWith(
        mockAdmin,
        resetTokenDto.newPassword
      );
    });

    it('should reject when admin not found by reset token', async () => {
      const resetTokenDto = {
        reset_token: 'invalid-reset-token',
        newPassword: 'newpassword123',
      };
      mockAuthService.findOneByResetToken.mockResolvedValue(null);

      await expect(mediator.changePassword(resetTokenDto)).rejects.toThrow('Invalid or Expired Token');
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password email', async () => {
      const adminWithSave = {
        ...mockAdmin,
        save: jest.fn().mockResolvedValue(undefined),
      };
      mockAuthService.findOne.mockResolvedValue(adminWithSave);
      mockAuthService.generateResetToken.mockResolvedValue({
        link: 'reset-link',
        key: 'reset-key',
      });


      const result = await mediator.forgotPassword(mockChangePasswordDto);

      expect(mockAuthService.findOne).toHaveBeenCalledWith({ email: mockChangePasswordDto.email });
      expect(mockAuthService.generateResetToken).toHaveBeenCalledWith(mockChangePasswordDto.email);
      expect(adminWithSave.save).toHaveBeenCalled();
      expect(mockMailService.sendInvitationEmail).toHaveBeenCalledWith(
        adminWithSave,
        'reset-password.hbs'
      );
    });

    it('should reject when admin not found for forgot password', async () => {
      mockAuthService.findOne.mockResolvedValue(null);

      await expect(mediator.forgotPassword(mockChangePasswordDto)).rejects.toThrow('Email not found');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const mockVerifiedAdmin = { ...mockAdmin };
      mockAuthService.verifyToken.mockResolvedValue(mockVerifiedAdmin);

      const result = await mediator.verifyToken(mockVerifyTokenDto);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith(mockVerifyTokenDto.token);
      expect(result).toEqual(mockVerifiedAdmin);
    });

    it('should handle token verification errors', async () => {
      const mockError = new Error('Invalid token');
      mockAuthService.verifyToken.mockRejectedValue(mockError);

      await expect(mediator.verifyToken(mockVerifyTokenDto)).rejects.toThrow('Invalid token');
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof mediator.login).toBe('function');
      expect(typeof mediator.changePassword).toBe('function');
      expect(typeof mediator.forgotPassword).toBe('function');
      expect(typeof mediator.verifyToken).toBe('function');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['service']).toBeDefined();
      expect(mediator['mailService']).toBeDefined();
      expect(mediator['jwtService']).toBeDefined();
    });
  });
});
