import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MicrocampMediator } from './microcamp.mediator';

@ApiTags('microcamp')
@Controller('microcamp')
export class MicrocampController {
  constructor(private readonly mediator: MicrocampMediator) {}
}
