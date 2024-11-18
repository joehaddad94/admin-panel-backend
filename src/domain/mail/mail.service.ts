import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Admin } from '../../core/data/database/entities/admin.entity';
import { UserService } from '../users/user.service';
import { sendBulkEmails } from '../../core/helpers/sendMail';
import { In } from 'typeorm';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UserService,
  ) {}

  sendInvitationEmail = async (admin: Admin, template: string) => {
    const { email, name, reset_token } = admin;

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${reset_token}&email=${email}`;
    try {
      const result = await this.mailerService.sendMail({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: email,
        subject: 'SEF Admin Panel Invitation!',
        template,
        context: {
          name,
          link,
        },
      });

      return this.logger.log(`Email sent to ${email}: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
      throw new Error(`Failed to send email to ${email}: ${error.message}`);
    }
  };

  sendEmails = async (
    emails: string[],
    template: string,
    subject: string,
    templateVariables?: Record<string, any>,
  ) => {
    const uniqueEmails = [...new Set(emails)];

    const validatedEmails = await this.usersService.findMany({
      email: In(uniqueEmails),
    });

    const foundEmails = validatedEmails.map((validatedEmail) => ({
      email: validatedEmail.email,
      name: `${validatedEmail.first_name} ${validatedEmail.last_name}`,
    }));

    const notFoundEmails = uniqueEmails.filter(
      (email) =>
        !foundEmails.some((validatedEmail) => validatedEmail.email === email),
    );

    const results = await sendBulkEmails(
      this.mailerService,
      foundEmails,
      template,
      subject,
      templateVariables,
    );

    if (notFoundEmails.length) {
      this.logger.warn(
        `The following emails were not found in the database: ${notFoundEmails.join(
          ', ',
        )}`,
      );
    }

    return { results, foundEmails, notFoundEmails };
  };
  async sendTestEmail(email: string, template: string) {
    try {
      const result = await this.mailerService.sendMail({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: email,
        subject: 'Test Email from SEF Admin Panel',
        template,
        context: {
          name: 'Test User',
          link: 'https://example.com/test',
        },
      });

      this.logger.log(`Test email sent to ${email}: ${result.messageId}`);
      return 'okay';
    } catch (error) {
      this.logger.error(`Failed to send test email to ${email}`, error.stack);
      throw new Error(
        `Failed to send test email to ${email}: ${error.message}`,
      );
    }
  }
}
