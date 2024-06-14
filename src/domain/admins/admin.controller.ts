import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminResponse } from 'src/core/config/documentation';
import { ManualCreateDto } from '../admins';
import { catcher } from 'src/core/helpers/operation';
import { AdminMediator } from './admin.mediator';

@ApiTags('admins')
@Controller()
export class AdminController {
  constructor(private readonly mediator: AdminMediator) {}

  @ApiResponse({
    type: AdminResponse,
  })
  @Post('create-admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAdmin(@Body() data: ManualCreateDto) {
    return catcher(async () => {
      const admin = await this.mediator.manualCreate(data);
      await this.mediator.invite(data);
      return admin;
    });
  }

  @ApiResponse({
    type: AdminResponse,
  })
  @Get('get-all-admins')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getAdmins() {
    return this.mediator.getAdmins();
  }
}
