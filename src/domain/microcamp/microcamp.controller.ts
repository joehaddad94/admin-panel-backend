import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MicrocampMediator } from './microcamp.mediator';

@ApiTags('microcamps')
@Controller('microcamps')
export class MicrocampController {
  constructor(private readonly mediator: MicrocampMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findAll() {
    return this.mediator.findAll();
  }
}
