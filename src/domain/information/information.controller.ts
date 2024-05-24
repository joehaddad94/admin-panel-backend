import { Controller, Get } from '@nestjs/common';
import { InformationMediator } from './informattion.mediator';

@Controller('information')
export class InformationController {
  constructor(private readonly mediator: InformationMediator) {}

  @Get()
  GetInformation() {
    return this.mediator.findInformation();
  }
}
