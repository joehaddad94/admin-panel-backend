import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

const logger = new Logger('EmailHelper');

export const sendBulkEmails = async (
  mailerService: MailerService,
  emails: { email: string; name: string }[],
  template: string,
  subject: string,
  templateVariables?: Record<string, any>,
) => {
  // Always use BCC for bulk emails to improve performance
  if (emails.length > 0) {
    try {
      const result = await mailerService.sendMail({
        from: '"SE Factory" <noreply@example.com>',
        to: 'selection@sefactory.io',
        cc: 'charbeld@sefactory.io, imadh@sefactory.io',
        bcc: emails.map(({ email }) => email),
        subject,
        template,
        context: {
          ...templateVariables,
        },
      });

      logger.log(`Bulk email sent with BCC to ${emails.length} recipients.`);
      return emails.map(({ email }) => ({ email, result }));
    } catch (error) {
      logger.error('Failed to send bulk email with BCC', error.stack);
      return emails.map(({ email }) => ({ email, error: error.message }));
    }
  }

  return [];
};
