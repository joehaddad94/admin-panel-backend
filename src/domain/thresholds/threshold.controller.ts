import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThresholdMediator } from './threshold.mediator';

@ApiTags()
@Controller('thresholds')
export class ThresholdController {
  constructor(private readonly mediator: ThresholdMediator) {}

  @Get()
  test() {
    return this.mediator.test();
  }
}
