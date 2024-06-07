import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Admin } from '../../core/data/database/entities/admin.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  sendRegistrationMail = async (admin: Admin) => {
    const { email, name, reset_token } = admin;

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${reset_token}&email=${email}`;
    try {
      const result = await this.mailerService.sendMail({
        from: '"SEF Admin Panel" <noreply@example.com>',
        to: email,
        subject: 'SEF Admin Panel Invitation!',
        template: './invitation.hbs',
        context: {
          name,
          link,
        },
      });

      this.logger.log(`Email sent to ${email}: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
      throw new Error(`Failed to send email to ${email}: ${error.message}`);
    }
  };
}
