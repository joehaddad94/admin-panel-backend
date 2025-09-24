import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';

@Injectable()
export class TemplateMediator {
  constructor(private readonly templateService: TemplateService) {}
}
