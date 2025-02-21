import { Injectable } from '@nestjs/common';
import { SectionService } from './section.service';

@Injectable()
export class SectionMediator {
  constructor(private readonly sectionService: SectionService) {}
}
