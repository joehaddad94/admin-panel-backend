import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MicrocampApplicationMediator } from './microcamp-applications.mediator';

@ApiTags('microcamp-applications')
@Controller('microcamp-applications')
export class MicrocampApplicationController {
  constructor(private readonly mediator: MicrocampApplicationMediator) {}
}
