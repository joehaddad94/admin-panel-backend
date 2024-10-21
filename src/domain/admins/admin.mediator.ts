/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { InviteDto, ManualCreateDto } from '../admins';
import {
  throwBadRequest,
  throwNotFound,
} from '../../core/settings/base/errors/errors';
import { catcher } from '../../core/helpers/operation';
import { format } from 'date-fns';
import { convertToCamelCase } from '../../core/helpers/camelCase';
import { Like, ILike } from 'typeorm';
import { In } from 'typeorm';
import { formatDate } from 'src/core/helpers/formatDate';

@Injectable()
export class AdminMediator {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailService: MailService,
  ) {}

  manualCreate = async (data: ManualCreateDto) => {
    const { name, email } = data;

    const existingAdmin = await this.adminService.findOne({ email });

    if (existingAdmin) {
      throwBadRequest({
        message: 'Admin already exists with the provided email.',
        errorCheck: true,
      });
    }

    const password = this.adminService.generateRandomPassword();
    const hashedPassword = await this.adminService.hashPassword(password);

    const newAdmin = this.adminService.create({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      login_attempts: 5,
    });

    await newAdmin.save();

    const { password: omitted, updated_at, ...adminData } = newAdmin;

    const convertedAdminData = convertToCamelCase(adminData);
    return {
      adminData: convertedAdminData,
      message: 'Admin added succesfully.',
    };
  };

  invite = async (data: InviteDto) => {
    return catcher(async () => {
      const { email } = data;
      const templateName = 'invitation.hbs';

      const existingAdmin = await this.adminService.findOne({
        email,
      });

      if (!existingAdmin) {
        throwBadRequest({
          message: 'Email does not exist',
          errorCheck: true,
        });
      }

      const { link, reset_token } = await this.adminService.generateLink(email);

      existingAdmin.reset_token = reset_token;
      existingAdmin.reset_token_expiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await existingAdmin.save();

      await this.mailService.sendInvitationEmail(existingAdmin, templateName);
      return { link };
    });
  };

  // getAdmins = async (page = 1, pageSize = 10000000, search = '', filters = []) => {
  getAdmins = async (page = 1, pageSize = 10000000, search = '') => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      // const searchFilter = {
      //   ...(search ? { name: ILike(`%${search}%`) } : {}),
      //   ...(filters.length > 0
      //     ? filters.reduce((acc, filter) => {
      //         if (filter.columnField === 'name') {
      //           acc.name = ILike(`%${filter.value}%`);
      //         } else if (filter.columnField === 'email') {
      //           acc.email = ILike(`%${filter.value}%`);
      //         }
      //         return acc;
      //       }, {})
      //     : {}),
      // };

      const [found, total] = await this.adminService.findAndCount(
        {},
        undefined,
        undefined,
        skip,
        take,
      );

      if (!found || found.length === 0) {
        return {
          admins: [],
          total: 0,
          page,
          pageSize,
        };
      }

      const adminsData = found.map(
        ({
          password,
          reset_token,
          reset_token_expiry,
          created_at,
          is_active,
          ...admin
        }) => ({
          ...admin,
          created_at: format(new Date(created_at), 'dd-MM-yy'),
          is_active: is_active ? 'Yes' : 'No',
        }),
      );

      return {
        admins: convertToCamelCase(adminsData),
        total,
        page,
        pageSize,
      };
    });
  };

  deleteAdmin = async (ids: string | string[]) => {
    return catcher(async () => {
      const idArray = Array.isArray(ids) ? ids : [ids];

      const admins = await this.adminService.findMany({ id: In(idArray) });

      if (admins.length === 0) {
        throwBadRequest({
          message: 'No admins with the provided ID(s) exist.',
          errorCheck: true,
        });
      }

      const adminIdsToDelete = admins.map((admin) => admin.id);

      await this.adminService.delete({ id: In(adminIdsToDelete) });

      return {
        message: `Admin(s) successfully deleted.`,
        deletedIds: adminIdsToDelete,
      };
    });
  };
}
