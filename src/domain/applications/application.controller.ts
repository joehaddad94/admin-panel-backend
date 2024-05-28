import { Controller, Get } from '@nestjs/common';
import { ApplicationMediator } from './application.mediator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Get()
  getApplications() {
    return this.mediator.findApplications();
  }
}
