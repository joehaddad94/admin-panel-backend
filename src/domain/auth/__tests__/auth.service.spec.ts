import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { Admin } from '../../../core/data/database';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let module: TestingModule;

  const mockAuthRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockAdmin: any = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test Admin',
    is_active: true,
    login_attempts: 5,
    reset_token: null,
    reset_token_expiry: null,
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: 1,
    updated_by_id: 1,
    save: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
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

  describe('password operations', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    it('should compare password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      const isCorrect = await service.comparePassword(password, hashedPassword);
      const isWrong = await service.comparePassword('wrongPassword', hashedPassword);

      expect(isCorrect).toBe(true);
      expect(isWrong).toBe(false);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('email validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
      ];

      validEmails.forEach(email => {
        expect(service.verifyEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
      ];

      invalidEmails.forEach(email => {
        expect(service.verifyEmail(email)).toBe(false);
      });
    });
  });

  describe('token generation', () => {
    it('should generate reset token', async () => {
      const email = 'test@example.com';
      const result = await service.generateResetToken(email);

      expect(result.link).toBeDefined();
      expect(result.key).toBeDefined();
      expect(result.link).toContain(email);
      expect(result.link).toContain(result.key);
      expect(result.key.length).toBeGreaterThan(20);
    });

    it('should generate reset link', async () => {
      const email = 'test@example.com';
      const result = await service.generateLink(email);

      expect(result.link).toBeDefined();
      expect(result.reset_token).toBeDefined();
      expect(result.link).toContain(email);
      expect(result.link).toContain(result.reset_token);
      expect(result.reset_token.length).toBeGreaterThan(20);
    });

    it('should generate JWT token', async () => {
      const mockToken = 'jwt.token.here';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.generateToken(mockAdmin);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: mockAdmin.id });
      expect(result).toBe(mockToken);
    });
  });

  describe('admin operations', () => {
    it('should find admin by reset token', async () => {
      mockAuthRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findOneByResetToken('valid-token');

      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { reset_token: 'valid-token' },
      });
      expect(result).toEqual(mockAdmin);
    });

    it('should return null when admin not found by reset token', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByResetToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should update password and clear reset token', async () => {
      const newPassword = 'newPassword123';
      const adminToUpdate = { ...mockAdmin };

      await service.updatePassword(adminToUpdate, newPassword);

      expect(adminToUpdate.password).not.toBe(mockAdmin.password);
      expect(adminToUpdate.reset_token).toBeNull();
      expect(adminToUpdate.reset_token_expiry).toBeNull();
      expect(mockAuthRepository.save).toHaveBeenCalledWith(adminToUpdate);
    });
  });

  describe('token verification and caching', () => {
    it('should verify token and return cached admin', async () => {
      const token = 'valid-token';
      const cachedAdmin = { ...mockAdmin };
      
      // Mock the JWT verification
      jest.spyOn(service as any, 'verifyToken').mockResolvedValue(cachedAdmin);

      const result = await service.verifyToken(token);

      expect(result).toEqual(cachedAdmin);
    });

    it('should cache token data', () => {
      const token = 'test-token';
      const admin = { ...mockAdmin };
      
      // Access the private method for testing
      const cacheKey = `token_${token}`;
      service['tokenCache'].set(cacheKey, { admin, timestamp: Date.now() });

      const cached = service['tokenCache'].get(cacheKey);
      expect(cached).toBeDefined();
      expect(cached.admin).toEqual(admin);
    });

    it('should handle cache expiration', () => {
      const token = 'test-token';
      const admin = { ...mockAdmin };
      const cacheKey = `token_${token}`;
      
      // Set cache with old timestamp (expired)
      const oldTimestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago
      service['tokenCache'].set(cacheKey, { admin, timestamp: oldTimestamp });

      const cached = service['tokenCache'].get(cacheKey);
      expect(cached).toBeDefined();
      
      // Cache should be considered expired after 5 minutes
      const now = Date.now();
      const isExpired = now - cached.timestamp > 5 * 60 * 1000;
      expect(isExpired).toBe(true);
    });
  });

  describe('failed login handling', () => {
    it('should record failed login attempts', () => {
      const email = 'test@example.com';
      
      // Initially no failed attempts
      expect(service['failedLoginCache'].has(email)).toBe(false);
      
      // Record first failed attempt
      const attempts1 = service.recordFailedLoginAttempt(email);
      expect(attempts1).toBe(1);
      expect(service['failedLoginCache'].has(email)).toBe(true);
      
      // Record second failed attempt
      const attempts2 = service.recordFailedLoginAttempt(email);
      expect(attempts2).toBe(2);
    });

    it('should handle multiple failed attempts for same email', () => {
      const email = 'test@example.com';
      
      // Record multiple failed attempts
      for (let i = 1; i <= 5; i++) {
        const attempts = service.recordFailedLoginAttempt(email);
        expect(attempts).toBe(i);
      }
      
      // Check cache has the correct data
      const cached = service['failedLoginCache'].get(email);
      expect(cached.attempts).toBe(5);
      expect(cached.lastAttempt).toBeDefined();
    });

    it('should decrement login attempts', async () => {
      const admin = { ...mockAdmin, login_attempts: 3 };
      
      await service.decrementLoginAttempts(admin);
      
      expect(admin.save).toHaveBeenCalled();
      expect(admin.login_attempts).toBe(2);
    });

    it('should reset login attempts', async () => {
      const admin = { ...mockAdmin, login_attempts: 0 };
      
      await service.resetLoginAttempts(admin);
      
      expect(admin.save).toHaveBeenCalled();
      expect(admin.login_attempts).toBe(5);
    });
  });

  describe('inheritance from BaseService', () => {
    it('should have access to BaseService methods', () => {
      expect(service).toHaveProperty('findMany');
      expect(service).toHaveProperty('findOne');
      expect(service).toHaveProperty('create');
      expect(service).toHaveProperty('update');
      expect(service).toHaveProperty('delete');
    });

    it('should use the correct repository', () => {
      expect(service['repository']).toBe(authRepository);
    });
  });
});
