import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProgramMediator } from './program.mediator';

@ApiTags('users')
@Controller('programs')
export class ProgramController {
  constructor(private readonly mediator: ProgramMediator) {}

  @Get()
  getPrograms() {
    return this.mediator.findPrograms();
  }
}
