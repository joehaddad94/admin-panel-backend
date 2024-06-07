import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Admin } from '../../core/data/database/entities/admin.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendRegistrationMail = async (user: Admin) => {
    const { email, name, reset_token } = user;

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${reset_token}&email=${email}`;

    await this.mailerService.sendMail({
      from: '"SEF Admin Panel" <noreply@example.com>',
      to: email,
      subject: 'SEF Admin Panel Invitation!',
      template: './invitation.hbs',
      context: {
        name,
        link,
      },
    });
  };
}
