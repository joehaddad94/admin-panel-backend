import { Injectable } from '@nestjs/common';
import { MicrocampApplicationService } from './microcamp-applications.service';
import { catcher } from 'src/core/helpers/operation';

@Injectable()
export class MicrocampApplicationMediator {
  constructor(
    private readonly microcampApplicationService: MicrocampApplicationService,
  ) {}
}
