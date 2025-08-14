import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from '../admin.service';
import { AdminRepository } from '../admin.repository';
import { Admin } from '../../../core/data/database';

describe('AdminService', () => {
  let service: AdminService;
  let repository: AdminRepository;

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

  const mockAdminRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    getQueryBuilder: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repository = module.get<AdminRepository>(AdminRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRandomPassword', () => {
    it('should generate a password with default length of 12', () => {
      const password = service.generateRandomPassword();
      expect(password).toHaveLength(12);
      expect(typeof password).toBe('string');
    });

    it('should generate a password with custom length', () => {
      const length = 16;
      const password = service.generateRandomPassword(length);
      expect(password).toHaveLength(length);
    });

    it('should generate different passwords on multiple calls', () => {
      const password1 = service.generateRandomPassword();
      const password2 = service.generateRandomPassword();
      expect(password1).not.toBe(password2);
    });

    it('should only contain valid characters', () => {
      const password = service.generateRandomPassword();
      const validChars = /^[a-zA-Z0-9!@#$%^&*()_+~`|}{[\]:;?><,./\-=]+$/;
      expect(password).toMatch(validChars);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = await service.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(plainPassword.length);
    });

    it('should generate different hashes for the same password', async () => {
      const plainPassword = 'testPassword123';
      const hash1 = await service.hashPassword(plainPassword);
      const hash2 = await service.hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hashedPassword = await service.hashPassword('');
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('generateLink', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv, VERIFY_CLIENT_URL: 'https://example.com/verify' };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should generate a link with reset token and email', async () => {
      const email = 'test@example.com';
      const result = await service.generateLink(email);

      expect(result).toHaveProperty('link');
      expect(result).toHaveProperty('reset_token');
      expect(result.link).toContain('https://example.com/verify');
      expect(result.link).toContain(`email=${email}`);
      expect(result.link).toContain('key=');
      expect(result.reset_token).toBeDefined();
      expect(typeof result.reset_token).toBe('string');
    });

    it('should generate different tokens for different calls', async () => {
      const email = 'test@example.com';
      const result1 = await service.generateLink(email);
      const result2 = await service.generateLink(email);

      expect(result1.reset_token).not.toBe(result2.reset_token);
      expect(result1.link).not.toBe(result2.link);
    });

    it('should handle special characters in email', async () => {
      const email = 'test+special@example.com';
      const result = await service.generateLink(email);

      expect(result.link).toContain(email);
    });

    it('should generate base64 compatible reset token', async () => {
      const email = 'test@example.com';
      const result = await service.generateLink(email);

      // Check that the token doesn't contain URL-unsafe characters
      expect(result.reset_token).not.toContain('+');
      expect(result.reset_token).not.toContain('/');
      expect(result.reset_token).not.toContain('=');
    });
  });

  describe('inherited methods from BaseService', () => {
    it('should have access to repository methods', () => {
      expect(service['adminRepository']).toBeDefined();
      expect(typeof service['adminRepository'].findOne).toBe('function');
      expect(typeof service['adminRepository'].create).toBe('function');
    });
  });
});

