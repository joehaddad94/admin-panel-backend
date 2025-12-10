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
import { ApiTags } from '@nestjs/swagger';
import { CycleMediator } from './cycle.mediator';
import { CreateEditCycleDto } from './dtos/create.cycle.dto';
import { GetAdmin } from '../../core/settings/decorators/admin.decorator';
import { Admin } from 'typeorm';

@ApiTags('cycles')
@Controller('cycles')
export class CycleController {
  constructor(private readonly mediator: CycleMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getAllCycles() {
    return this.mediator.findCycles();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getCycles(@Param('id') programId: number) {
    return this.mediator.findCycles(programId);
  }

  @Post('create-edit-cycle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createCycle(
    @GetAdmin() admin: Admin,
    @Body() data: CreateEditCycleDto,
  ) {
    return this.mediator.createEditCycle(admin, data);
  }

  @Delete('delete-cycle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteCycle(@Body() data: string | string[]) {
    return this.mediator.deleteCycle(data);
  }
}
