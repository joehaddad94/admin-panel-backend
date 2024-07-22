import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThresholdMediator } from './threshold.mediator';
import { CreateEditThresholdsDto } from './dtos/create-edit.dto';

@ApiTags('thresholds')
@Controller('thresholds')
export class ThresholdController {
  constructor(private readonly mediator: ThresholdMediator) {}

  @Post('create-edit')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createEditThreshold(@Body() data: CreateEditThresholdsDto) {
    return this.mediator.createEditThresholds(data);
  }
}
