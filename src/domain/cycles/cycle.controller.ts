import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CycleMediator } from './cycle.mediator';
import { CreateCycleDto } from './dtos/create.cycle.dto';
import { GetAdmin } from '../../core/settings/decorators/admin.decorator';
import { Admin } from 'typeorm';
import { GetCyclesDto } from './dtos/get.cycle.dto';

@ApiTags('cycles')
@Controller('cycles')
export class CycleController {
  constructor(private readonly mediator: CycleMediator) {}

  @Get()
  getCycle(@Body() data: GetCyclesDto) {
    return this.mediator.findCycles(data);
  }

  @Post('create-cycle')
  async createCycle(@GetAdmin() admin: Admin, @Body() data: CreateCycleDto) {
    return this.mediator.createCycle(admin, data);
  }
}
