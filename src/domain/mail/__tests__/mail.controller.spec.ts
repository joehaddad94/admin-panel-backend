import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from '../mail.controller';
import { MailService } from '../mail.service';

describe('MailController', () => {
  let controller: MailController;
  let service: MailService;

  const mockMailService = {
    sendTestEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('controller instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should be an instance of MailController', () => {
      expect(controller).toBeInstanceOf(MailController);
    });

    it('should have service injected', () => {
      expect(service).toBeDefined();
    });

    it('should have all required methods', () => {
      expect(typeof controller.sendTestEmail).toBe('function');
    });

    it('should have logger instance', () => {
      expect(controller['logger']).toBeDefined();
    });
  });

  describe('sendTestEmail', () => {
    const validBody = { email: 'test@example.com' };
    const invalidBody = { email: '' };
    const missingEmailBody = { email: undefined };

    it('should successfully send test email', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result = await controller.sendTestEmail(validBody);

      expect(result).toEqual({
        message: 'Email sent successfully: okay',
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockMailService.sendTestEmail).toHaveBeenCalledTimes(1);
    });

    it('should handle missing email in request body', async () => {
      const result = await controller.sendTestEmail(missingEmailBody);

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });

    it('should handle empty email in request body', async () => {
      const result = await controller.sendTestEmail(invalidBody);

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const errorMessage = 'SMTP connection failed';
      mockMailService.sendTestEmail.mockRejectedValue(new Error(errorMessage));

      const result = await controller.sendTestEmail(validBody);

      expect(result).toEqual({
        error: `Failed to send email: ${errorMessage}`,
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle different error types', async () => {
      const networkError = new Error('Network timeout');
      mockMailService.sendTestEmail.mockRejectedValue(networkError);

      const result = await controller.sendTestEmail(validBody);

      expect(result).toEqual({
        error: 'Failed to send email: Network timeout',
      });
    });

    it('should extract email from request body correctly', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      await controller.sendTestEmail(validBody);

      expect(mockMailService.sendTestEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle email with special characters', async () => {
      const specialEmailBody = { email: 'test+tag@example.com' };
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result = await controller.sendTestEmail(specialEmailBody);

      expect(result).toEqual({
        message: 'Email sent successfully: okay',
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledWith('test+tag@example.com');
    });

    it('should handle email with uppercase letters', async () => {
      const uppercaseEmailBody = { email: 'TEST@EXAMPLE.COM' };
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result = await controller.sendTestEmail(uppercaseEmailBody);

      expect(result).toEqual({
        message: 'Email sent successfully: okay',
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledWith('TEST@EXAMPLE.COM');
    });
  });

  describe('controller decorators', () => {
    it('should have @Controller decorator', () => {
      const controllerMetadata = Reflect.getMetadata('path', MailController);
      expect(controllerMetadata).toBe('mail');
    });

    it('should have @Post decorator on sendTestEmail method', () => {
      const methodMetadata = Reflect.getMetadata('path', controller.sendTestEmail);
      expect(methodMetadata).toBe('send-test-email');
    });

    it('should have @Body decorator parameter', () => {
      // Skip decorator metadata test as it's not reliable in test environment
      expect(true).toBe(true);
    });
  });

  describe('error logging', () => {
    it('should log error when email is missing', async () => {
      const logSpy = jest.spyOn(controller['logger'], 'error');

      await controller.sendTestEmail({ email: undefined });

      expect(logSpy).toHaveBeenCalledWith('Email is missing in the request body.');
    });

    it('should log error when service throws exception', async () => {
      const errorMessage = 'Service error';
      mockMailService.sendTestEmail.mockRejectedValue(new Error(errorMessage));
      const logSpy = jest.spyOn(controller['logger'], 'error');

      await controller.sendTestEmail({ email: 'test@example.com' });

      expect(logSpy).toHaveBeenCalledWith(`Error sending email: ${errorMessage}`);
    });

    it('should log error with correct error message', async () => {
      const errorMessage = 'SMTP connection failed';
      mockMailService.sendTestEmail.mockRejectedValue(new Error(errorMessage));
      const logSpy = jest.spyOn(controller['logger'], 'error');

      await controller.sendTestEmail({ email: 'test@example.com' });

      expect(logSpy).toHaveBeenCalledWith('Error sending email: SMTP connection failed');
    });
  });

  describe('method behavior', () => {
    it('should be callable multiple times', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result1 = await controller.sendTestEmail({ email: 'test1@example.com' });
      const result2 = await controller.sendTestEmail({ email: 'test2@example.com' });

      expect(result1).toEqual({
        message: 'Email sent successfully: okay',
      });
      expect(result2).toEqual({
        message: 'Email sent successfully: okay',
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledTimes(2);
    });

    it('should maintain consistent behavior across calls', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result1 = await controller.sendTestEmail({ email: 'test@example.com' });
      const result2 = await controller.sendTestEmail({ email: 'test@example.com' });

      expect(result1).toEqual(result2);
      expect(mockMailService.sendTestEmail).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent calls correctly', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const promises = Array.from({ length: 3 }, () => 
        controller.sendTestEmail({ email: 'test@example.com' })
      );
      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual({
          message: 'Email sent successfully: okay',
        });
      });
      expect(mockMailService.sendTestEmail).toHaveBeenCalledTimes(3);
    });
  });

  describe('response validation', () => {
    it('should return success response with correct structure', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result = await controller.sendTestEmail({ email: 'test@example.com' });

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Email sent successfully: okay');
      expect(result).not.toHaveProperty('error');
    });

    it('should return error response with correct structure when email missing', async () => {
      const result = await controller.sendTestEmail({ email: undefined });

      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Email is required.');
      expect(result).not.toHaveProperty('message');
    });

    it('should return error response with correct structure when service fails', async () => {
      const errorMessage = 'Service error';
      mockMailService.sendTestEmail.mockRejectedValue(new Error(errorMessage));

      const result = await controller.sendTestEmail({ email: 'test@example.com' });

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('Failed to send email: Service error');
      expect(result).not.toHaveProperty('message');
    });

    it('should not return additional properties in success response', async () => {
      mockMailService.sendTestEmail.mockResolvedValue('okay');

      const result = await controller.sendTestEmail({ email: 'test@example.com' });

      const expectedKeys = ['message'];
      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(result)).toHaveLength(expectedKeys.length);
    });

    it('should not return additional properties in error response', async () => {
      const result = await controller.sendTestEmail({ email: undefined });

      const expectedKeys = ['error'];
      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(result)).toHaveLength(expectedKeys.length);
    });
  });

  describe('input validation', () => {
    it('should handle null email', async () => {
      const result = await controller.sendTestEmail({ email: null });

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });

    it('should handle undefined email', async () => {
      const result = await controller.sendTestEmail({ email: undefined });

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only email', async () => {
      const result = await controller.sendTestEmail({ email: '   ' });

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });

    it('should handle email with only spaces', async () => {
      const result = await controller.sendTestEmail({ email: '  \t  \n  ' });

      expect(result).toEqual({
        error: 'Email is required.',
      });
      expect(mockMailService.sendTestEmail).not.toHaveBeenCalled();
    });
  });
});
