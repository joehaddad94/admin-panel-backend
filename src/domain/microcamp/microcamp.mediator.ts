import { Injectable } from '@nestjs/common';
import { MicrocampService } from './microcamp.service';

@Injectable()
export class MicrocampMediator {
  constructor(private readonly microcampService: MicrocampService) {}
}
