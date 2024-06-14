import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AdminResponse } from 'src/core/config/documentation';
import { ManualCreateDto } from '../auth';
import { catcher } from 'src/core/helpers/operation';
import { AdminMediator } from './admin.mediator';

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
}
