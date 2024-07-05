import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecisionDateMediator } from './decision-date.mediator';

@ApiTags('decision-tags')
@Controller('decision-tags')
export class DecisionDateController {
  constructor(private readonly mediator: DecisionDateMediator) {}
}
