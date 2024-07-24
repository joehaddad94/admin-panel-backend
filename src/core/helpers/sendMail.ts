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
  const emailPromises = emails.map(async ({ email, name }) => {
    // const link = `${process.env.VERIFY_CLIENT_URL}?key=${resetToken}&email=${email}`;

    try {
      const result = await mailerService.sendMail({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: email,
        subject,
        template,
        context: {
          name,
          //   link,
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
