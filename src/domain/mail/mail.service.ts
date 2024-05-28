import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Admin } from '../../core/data/database/entities/admin.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendRegistractionMail = async (user: Admin) => {
    const { email, name, verificationKey } = user;

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${verificationKey}&email=${email}`;

    await this.mailerService.sendMail({
      from: '"SEF Dashboard" <noreply@example.com>',
      to: email,
      subject: 'SEF Dashboard Invitation!',
      template: './invitation.hbs',
      context: {
        name,
        link,
      },
    });
  };
}
