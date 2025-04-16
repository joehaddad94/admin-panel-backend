import { Injectable } from '@nestjs/common';
import { MicrocampService } from './microcamp.service';
import { catcher } from 'src/core/helpers/operation';

@Injectable()
export class MicrocampMediator {
  constructor(private readonly microcampService: MicrocampService) {}

  async findAll() {
    return catcher(async () => {
      const microcamps = await this.microcampService.findMany({});
      return microcamps;
    });
  }
}
