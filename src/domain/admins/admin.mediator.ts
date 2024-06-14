import { Injectable } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { InviteDto, ManualCreateDto } from '../admins';
import { throwBadRequest } from 'src/core/settings/base/errors/errors';
import { catcher } from 'src/core/helpers/operation';

@Injectable()
export class AdminMediator {
  constructor(
    private readonly service: AdminService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  manualCreate = async (data: ManualCreateDto) => {
    const { name, email } = data;

    const existingAdmin = await this.service.findOne({ email });

    if (existingAdmin) {
      throwBadRequest({
        message: 'Admin already exists with the provided email.',
        errorCheck: true,
      });
    }

    const password = this.service.generateRandomPassword();
    const hashedPassword = await this.service.hashPassword(password);

    const admin = this.service.create({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      isActive: true,
      login_attempts: 5,
    });

    await admin.save();

    const { password: omitted, ...adminData } = admin;
    return adminData;
  };

  invite = async (data: InviteDto) => {
    return catcher(async () => {
      const { email } = data;
      const templateName = 'invitation.hbs';

      const existingAdmin = await this.service.findOne({
        email,
      });

      if (!existingAdmin) {
        throwBadRequest({
          message: 'Email does not exist',
          errorCheck: true,
        });
      }

      const { link, reset_token } = await this.service.generateLink(email);

      existingAdmin.reset_token = reset_token;
      existingAdmin.reset_token_expiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await existingAdmin.save();

      await this.mailService.sendMail(existingAdmin, templateName);
      return { link };
    });
  };

  getAdmins = async () => {
    return catcher(async () => {
      const admins = await this.service.findMany({});
      const adminsData = admins.map(
        ({ password, reset_token, reset_token_expiry, ...admin }) => admin,
      );
      return adminsData;
    });
  };
}
