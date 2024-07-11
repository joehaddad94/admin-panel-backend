import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecisionDateMediator } from './decision-date.mediator';
import { CreateEditDecisionDateDto } from './dtos/create-dates.dto';

@ApiTags('decision-dates')
@Controller('decision-dates')
export class DecisionDateController {
  constructor(private readonly mediator: DecisionDateMediator) {}

  @Post()
  createEditDecisionDate(@Body() data: CreateEditDecisionDateDto) {
    return this.mediator.createEditDates(data);
  }
}
