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
  if (emails.length > 1) {
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

  const emailPromises = emails.map(async ({ email, name }) => {
    try {
      const result = await mailerService.sendMail({
        from: '"SE Factory" <noreply@example.com>',
        to: email,
        cc: 'charbeld@sefactory.io, imadh@sefactory.io',
        subject,
        template,
        context: {
          name,
          ...templateVariables,
        },
      });

      logger.log(`Email sent to ${email}: ${result.messageId}`);
      return { email, result };
    } catch (error) {
      logger.error(`Failed to send email to ${email}`, error.stack);
      return { email, error: error.message };
    }
  });

  return Promise.all(emailPromises);
};
