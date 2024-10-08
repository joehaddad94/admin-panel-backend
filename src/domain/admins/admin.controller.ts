import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminResponse } from 'src/core/config/documentation';
import { ManualCreateDto } from '../admins';
import { catcher } from 'src/core/helpers/operation';
import { AdminMediator } from './admin.mediator';
import { GetAdmin } from 'src/core/settings/decorators/admin.decorator';
import { Admin } from 'src/core/data/database';

@ApiTags('admins')
@Controller('admins')
export class AdminController {
  constructor(private readonly mediator: AdminMediator) {}

  @ApiResponse({
    type: AdminResponse,
  })
  @Post('create-admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAdmin(@Body() data: ManualCreateDto) {
    return catcher(async () => {
      const newAdmin = await this.mediator.manualCreate(data);
      await this.mediator.invite(data);
      return newAdmin;
    });
  }

  @ApiResponse({
    type: AdminResponse,
  })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getAdmins(
    @Body() body: { page?: number; pageSize?: number; search?: string },
  ) {
    const { page = 1, pageSize = 100, search = '' } = body;
    return this.mediator.getAdmins(page, pageSize, search);
  }

  @ApiResponse({
    status: 204,
    description: 'Admin successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Delete('delete-admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteAdmin(@Body() data: string | string[]) {
    return this.mediator.deleteAdmin(data);
  }
}
