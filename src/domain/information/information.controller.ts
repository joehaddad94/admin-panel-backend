import { Controller, Get } from '@nestjs/common';
import { InformationMediator } from './informattion.mediator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('information')
@Controller('information')
export class InformationController {
  constructor(private readonly mediator: InformationMediator) {}

  @Get()
  GetInformation() {
    return this.mediator.findInformation();
  }
}
