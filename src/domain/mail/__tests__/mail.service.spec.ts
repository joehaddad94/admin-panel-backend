import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../../users/user.service';
import { Admin } from '../../../core/data/database/entities/admin.entity';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;
  let userService: UserService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockUserService = {
    findMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('service instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of MailService', () => {
      expect(service).toBeInstanceOf(MailService);
    });

    it('should have dependencies injected', () => {
      expect(mailerService).toBeDefined();
      expect(userService).toBeDefined();
    });

    it('should have all required methods', () => {
      expect(typeof service.sendInvitationEmail).toBe('function');
      expect(typeof service.sendEmails).toBe('function');
      expect(typeof service.sendTestEmail).toBe('function');
    });
  });

  describe('sendInvitationEmail', () => {
    const mockAdmin: Admin = {
      id: 1,
      email: 'test@example.com',
      name: 'Test Admin',
      reset_token: 'test-token-123',
    } as Admin;

    const mockTemplate = 'invitation-template';

    it('should successfully send invitation email', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      await service.sendInvitationEmail(mockAdmin, mockTemplate);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: 'test@example.com',
        subject: 'SEF Admin Panel Invitation!',
        template: 'invitation-template',
        context: {
          name: 'Test Admin',
          link: `${process.env.VERIFY_CLIENT_URL}?key=test-token-123&email=test@example.com`,
        },
      });
    });

    it('should handle mailer service errors', async () => {
      const errorMessage = 'SMTP connection failed';
      mockMailerService.sendMail.mockRejectedValue(new Error(errorMessage));

      await expect(service.sendInvitationEmail(mockAdmin, mockTemplate))
        .rejects.toThrow(`Failed to send email to test@example.com: ${errorMessage}`);

      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('should construct correct verification link', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      await service.sendInvitationEmail(mockAdmin, mockTemplate);

      const expectedLink = `${process.env.VERIFY_CLIENT_URL}?key=test-token-123&email=test@example.com`;
      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            link: expectedLink,
          }),
        })
      );
    });

    it('should use correct email template and subject', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      await service.sendInvitationEmail(mockAdmin, mockTemplate);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'SEF Admin Panel Invitation!',
          template: 'invitation-template',
        })
      );
    });
  });

  describe('sendEmails', () => {
    const mockEmails = ['user1@example.com', 'user2@example.com', 'user1@example.com'];
    const mockTemplate = 'notification-template';
    const mockSubject = 'Test Notification';
    const mockTemplateVariables = { company: 'SEF' };

    const mockValidatedUsers = [
      { email: 'user1@example.com', first_name: 'John', last_name: 'Doe' },
      { email: 'user2@example.com', first_name: 'Jane', last_name: 'Smith' },
    ];

    beforeEach(() => {
      // Mock the sendBulkEmails helper function
      jest.doMock('../../../core/helpers/sendMail', () => ({
        sendBulkEmails: jest.fn().mockResolvedValue(['success', 'success']),
      }));
    });

    it('should successfully send emails to valid users', async () => {
      mockUserService.findMany.mockResolvedValue(mockValidatedUsers);
      mockMailerService.sendMail.mockResolvedValue({ messageId: 'msg-123' });

      const result = await service.sendEmails(mockEmails, mockTemplate, mockSubject, mockTemplateVariables);

      expect(result).toBeDefined();
      expect(result.foundEmails).toHaveLength(2);
      expect(result.notFoundEmails).toHaveLength(0);
      expect(result.results).toHaveLength(2);
    });

    it('should handle empty email list', async () => {
      const result = await service.sendEmails([], mockTemplate, mockSubject);

      expect(result).toEqual({
        results: [],
        foundEmails: [],
        notFoundEmails: [],
      });
      expect(mockUserService.findMany).not.toHaveBeenCalled();
    });

    it('should remove duplicate emails', async () => {
      const duplicateEmails = ['user1@example.com', 'user1@example.com', 'user2@example.com'];
      mockUserService.findMany.mockResolvedValue(mockValidatedUsers);

      await service.sendEmails(duplicateEmails, mockTemplate, mockSubject);

      expect(mockUserService.findMany).toHaveBeenCalledWith({
        email: expect.objectContaining({
          _type: 'in',
          _value: ['user1@example.com', 'user2@example.com'],
        }),
      });
    });

    it('should handle case where no valid emails found', async () => {
      mockUserService.findMany.mockResolvedValue([]);

      const result = await service.sendEmails(mockEmails, mockTemplate, mockSubject);

      expect(result.foundEmails).toHaveLength(0);
      expect(result.notFoundEmails).toHaveLength(2);
      expect(result.results).toHaveLength(0);
    });

    it('should handle case where some emails are not found', async () => {
      const mixedEmails = ['user1@example.com', 'invalid@example.com', 'user2@example.com'];
      mockUserService.findMany.mockResolvedValue(mockValidatedUsers);

      const result = await service.sendEmails(mixedEmails, mockTemplate, mockSubject);

      expect(result.foundEmails).toHaveLength(2);
      expect(result.notFoundEmails).toHaveLength(1);
      expect(result.notFoundEmails).toContain('invalid@example.com');
    });

    it('should call user service with correct parameters', async () => {
      mockUserService.findMany.mockResolvedValue(mockValidatedUsers);

      await service.sendEmails(mockEmails, mockTemplate, mockSubject);

      expect(mockUserService.findMany).toHaveBeenCalledWith({
        email: expect.objectContaining({
          _type: 'in',
          _value: ['user1@example.com', 'user2@example.com'],
        }),
      });
    });

    it('should format user names correctly', async () => {
      mockUserService.findMany.mockResolvedValue(mockValidatedUsers);

      const result = await service.sendEmails(mockEmails, mockTemplate, mockSubject);

      expect(result.foundEmails[0].name).toBe('John Doe');
      expect(result.foundEmails[1].name).toBe('Jane Smith');
    });
  });

  describe('sendTestEmail', () => {
    const testEmail = 'test@example.com';

    it('should successfully send test email', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      const result = await service.sendTestEmail(testEmail);

      expect(result).toBe('okay');
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: 'test@example.com',
        subject: 'Test Email from SEF Admin Panel',
        text: 'This is a test email message.',
        html: '<p>This is a test email message.</p>',
      });
    });

    it('should handle mailer service errors', async () => {
      const errorMessage = 'SMTP connection failed';
      mockMailerService.sendMail.mockRejectedValue(new Error(errorMessage));

      await expect(service.sendTestEmail(testEmail))
        .rejects.toThrow(`Failed to send test email to test@example.com: ${errorMessage}`);

      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('should use correct email format and content', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      await service.sendTestEmail(testEmail);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"SEF Admin Panel" <noreply@example.com>',
          to: 'test@example.com',
          subject: 'Test Email from SEF Admin Panel',
          text: 'This is a test email message.',
          html: '<p>This is a test email message.</p>',
        })
      );
    });

    it('should log success message', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.sendTestEmail(testEmail);

      expect(logSpy).toHaveBeenCalledWith(`Test email sent to test@example.com: msg-123`);
    });

    it('should log error message on failure', async () => {
      const errorMessage = 'SMTP connection failed';
      mockMailerService.sendMail.mockRejectedValue(new Error(errorMessage));

      const logSpy = jest.spyOn(service['logger'], 'error');

      try {
        await service.sendTestEmail(testEmail);
      } catch (error) {
        // Expected to throw
      }

      expect(logSpy).toHaveBeenCalledWith(
        `Failed to send test email to test@example.com`,
        expect.any(String)
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network timeout');
      mockMailerService.sendMail.mockRejectedValue(networkError);

      await expect(service.sendTestEmail('test@example.com'))
        .rejects.toThrow('Failed to send test email to test@example.com: Network timeout');
    });

    it('should handle authentication errors gracefully', async () => {
      const authError = new Error('Invalid credentials');
      mockMailerService.sendMail.mockRejectedValue(authError);

      await expect(service.sendTestEmail('test@example.com'))
        .rejects.toThrow('Failed to send test email to test@example.com: Invalid credentials');
    });

    it('should preserve original error messages', async () => {
      const originalError = new Error('Original error message');
      mockMailerService.sendMail.mockRejectedValue(originalError);

      await expect(service.sendTestEmail('test@example.com'))
        .rejects.toThrow('Failed to send test email to test@example.com: Original error message');
    });
  });

  describe('method behavior', () => {
    it('should be callable multiple times', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      const result1 = await service.sendTestEmail('test1@example.com');
      const result2 = await service.sendTestEmail('test2@example.com');

      expect(result1).toBe('okay');
      expect(result2).toBe('okay');
      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should maintain consistent behavior across calls', async () => {
      const mockResult = { messageId: 'msg-123' };
      mockMailerService.sendMail.mockResolvedValue(mockResult);

      const result1 = await service.sendTestEmail('test@example.com');
      const result2 = await service.sendTestEmail('test@example.com');

      expect(result1).toBe(result2);
      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(2);
    });
  });
});
