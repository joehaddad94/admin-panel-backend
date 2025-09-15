import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { VerifyTokenDto } from '../dto/verifyToken.dto';

describe('Auth DTOs', () => {
  describe('LoginDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const dto = Object.assign(new LoginDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require email', async () => {
      const invalidData = {
        password: 'password123',
      };

      const dto = Object.assign(new LoginDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should require valid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const dto = Object.assign(new LoginDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should require password', async () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const dto = Object.assign(new LoginDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should not accept empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const dto = Object.assign(new LoginDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('ChangePasswordDto', () => {
    it('should validate valid data with email and newPassword', async () => {
      const validData = {
        email: 'test@example.com',
        newPassword: 'newpassword123',
      };

      const dto = Object.assign(new ChangePasswordDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate valid data with reset_token and newPassword', async () => {
      const validData = {
        reset_token: 'valid-reset-token',
        newPassword: 'newpassword123',
      };

      const dto = Object.assign(new ChangePasswordDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require valid email format when email is provided', async () => {
      const invalidData = {
        email: 'invalid-email',
        newPassword: 'newpassword123',
      };

      const dto = Object.assign(new ChangePasswordDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should require minimum password length', async () => {
      const invalidData = {
        email: 'test@example.com',
        newPassword: '12345', // Less than 6 characters
      };

      const dto = Object.assign(new ChangePasswordDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('should accept empty data (all fields optional)', async () => {
      const emptyData = {};

      const dto = Object.assign(new ChangePasswordDto(), emptyData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only email', async () => {
      const validData = {
        email: 'test@example.com',
      };

      const dto = Object.assign(new ChangePasswordDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only reset_token', async () => {
      const validData = {
        reset_token: 'valid-reset-token',
      };

      const dto = Object.assign(new ChangePasswordDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate with only newPassword', async () => {
      const validData = {
        newPassword: 'newpassword123',
      };

      const dto = Object.assign(new ChangePasswordDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('VerifyTokenDto', () => {
    it('should validate valid data', async () => {
      const validData = {
        token: 'valid-jwt-token',
      };

      const dto = Object.assign(new VerifyTokenDto(), validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should require token', async () => {
      const invalidData = {};

      const dto = Object.assign(new VerifyTokenDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should not accept empty token', async () => {
      const invalidData = {
        token: '',
      };

      const dto = Object.assign(new VerifyTokenDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should require string token', async () => {
      const invalidData = {
        token: 123, // Number instead of string
      };

      const dto = Object.assign(new VerifyTokenDto(), invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isString).toBeDefined();
    });
  });
});
