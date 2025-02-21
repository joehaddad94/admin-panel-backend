import { ApiTags } from '@nestjs/swagger';
import { SectionMediator } from './section.mediator';
import { Controller } from '@nestjs/common';

@ApiTags('sections')
@Controller('sections')
export class SectionController {
  constructor(private readonly mediator: SectionMediator) {}
}
