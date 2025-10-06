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

    if (uniqueEmails.length === 0) {
      return { results: [], foundEmails: [], notFoundEmails: [] };
    }

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

    // Early return if no valid emails found
    if (foundEmails.length === 0) {
      this.logger.warn(
        `No valid emails found in the database: ${notFoundEmails.join(', ')}`,
      );
      return { results: [], foundEmails: [], notFoundEmails };
    }

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

  async sendTestEmail(email: string) {
    try {
      const result = await this.mailerService.sendMail({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: email,
        subject: 'Test Email from SEF Admin Panel',
        text: 'This is a test email message.',
        html: '<p>This is a test email message.</p>',
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

  async sendTestEmailWithTemplate(
    emails: string[],
    templateName: string,
    subject: string,
    htmlContent: string,
  ) {
    const uniqueEmails = [...new Set(emails)];

    if (uniqueEmails.length === 0) {
      return { results: [], foundEmails: [], notFoundEmails: [] };
    }

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

    if (foundEmails.length === 0) {
      this.logger.warn(
        `No valid emails found in the database: ${notFoundEmails.join(', ')}`,
      );
      return { results: [], foundEmails: [], notFoundEmails };
    }

    try {
      const mailOptions: any = {
        from: '"SE Factory" <noreply@example.com>',
        to: 'selection@sefactory.io',
        cc: 'charbeld@sefactory.io, imadh@sefactory.io',
        bcc: foundEmails.map(({ email }) => email),
        subject: `${subject} - ${templateName}`,
        html: htmlContent,
      };

      const result = await this.mailerService.sendMail(mailOptions);

      this.logger.log(`Bulk test template email sent with BCC to ${foundEmails.length} recipients: ${result.messageId}`);
      
      const results = foundEmails.map(({ email }) => ({ email, result: 'sent' }));
      
      return { results, foundEmails, notFoundEmails };
    } catch (error) {
      this.logger.error('Failed to send bulk test template email', error.stack);
      const results = foundEmails.map(({ email }) => ({ email, error: error.message }));
      return { results, foundEmails, notFoundEmails };
    }
  }

  async sendReminderEmails(
    emails: string[],
    template: string,
    subject: string,
    templateVariables?: Record<string, any>,
    cc?: string[],
  ) {
    try {
      const mailOptions: any = {
        from: '"SE Factory" <noreply@example.com>',
        to: emails.join(', '),
        subject,
        template,
        context: {
          ...templateVariables,
        },
      };

      if (cc && cc.length > 0) {
        mailOptions.cc = cc.join(', ');
      }

      const results = await this.mailerService.sendMail(mailOptions);

      const ccInfo = cc && cc.length > 0 ? ` (CC: ${cc.join(', ')})` : '';
      this.logger.log(`Reminder emails sent to ${emails.length} recipients${ccInfo}`);
      return { success: true, messageId: results.messageId };
    } catch (error) {
      this.logger.error('Failed to send reminder emails', error.stack);
      throw new Error(`Failed to send reminder emails: ${error.message}`);
    }
  }
}
