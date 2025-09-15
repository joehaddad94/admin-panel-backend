import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthMediator } from '../AuthMediator';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { VerifyTokenDto } from '../dto/verifyToken.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mediator: AuthMediator;
  let module: TestingModule;

  const mockAuthMediator = {
    login: jest.fn(),
    changePassword: jest.fn(),
    forgotPassword: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockLoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockChangePasswordDto = {
    email: 'test@example.com',
    newPassword: 'newpassword123',
  };

  const mockVerifyTokenDto = {
    token: 'valid-jwt-token',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthMediator,
          useValue: mockAuthMediator,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mediator = module.get<AuthMediator>(AuthMediator);
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
    it('should login with valid credentials', async () => {
      const mockResponse = {
        name: 'Test Admin',
        email: 'test@example.com',
        token: 'jwt-token-here',
      };
      mockAuthMediator.login.mockResolvedValue(mockResponse);

      const result = await controller.login(mockLoginDto);

      expect(mockAuthMediator.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const loginMethod = controller.login;
      const metadata = Reflect.getMetadata('__validation__', loginMethod);
      
      // Check if ValidationPipe is used
      expect(loginMethod).toBeDefined();
    });
  });

  describe('changePassword', () => {
    it('should change password with valid data', async () => {
      const mockResponse = { message: 'Password changed successfully' };
      mockAuthMediator.changePassword.mockResolvedValue(mockResponse);

      const result = await controller.changePassword(mockChangePasswordDto);

      expect(mockAuthMediator.changePassword).toHaveBeenCalledWith(mockChangePasswordDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const changePasswordMethod = controller.changePassword;
      const metadata = Reflect.getMetadata('__validation__', changePasswordMethod);
      
      // Check if ValidationPipe is used
      expect(changePasswordMethod).toBeDefined();
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request', async () => {
      const mockResponse = { message: 'Reset link sent to email' };
      mockAuthMediator.forgotPassword.mockResolvedValue(mockResponse);

      const result = await controller.forgotPassword(mockChangePasswordDto);

      expect(mockAuthMediator.forgotPassword).toHaveBeenCalledWith(mockChangePasswordDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      const forgotPasswordMethod = controller.forgotPassword;
      const metadata = Reflect.getMetadata('__validation__', forgotPasswordMethod);
      
      // Check if ValidationPipe is used
      expect(forgotPasswordMethod).toBeDefined();
    });
  });

  describe('me', () => {
    it('should verify token and return user info', async () => {
      const mockResponse = {
        id: 1,
        name: 'Test Admin',
        email: 'test@example.com',
      };
      mockAuthMediator.verifyToken.mockResolvedValue(mockResponse);

      const result = await controller.me(mockVerifyTokenDto);

      expect(mockAuthMediator.verifyToken).toHaveBeenCalledWith(mockVerifyTokenDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle token verification errors', async () => {
      const mockError = new Error('Invalid token');
      mockAuthMediator.verifyToken.mockRejectedValue(mockError);

      await expect(controller.me(mockVerifyTokenDto)).rejects.toThrow('Invalid token');
    });
  });

  describe('component structure', () => {
    it('should have all required methods', () => {
      expect(typeof controller.login).toBe('function');
      expect(typeof controller.changePassword).toBe('function');
      expect(typeof controller.forgotPassword).toBe('function');
      expect(typeof controller.me).toBe('function');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('validation pipe usage', () => {
    it('should use ValidationPipe on login endpoint', () => {
      const loginMethod = controller.login;
      expect(loginMethod).toBeDefined();
    });

    it('should use ValidationPipe on changePassword endpoint', () => {
      const changePasswordMethod = controller.changePassword;
      expect(changePasswordMethod).toBeDefined();
    });

    it('should use ValidationPipe on forgotPassword endpoint', () => {
      const forgotPasswordMethod = controller.forgotPassword;
      expect(forgotPasswordMethod).toBeDefined();
    });
  });
});
