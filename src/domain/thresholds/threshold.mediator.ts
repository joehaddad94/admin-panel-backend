import { Injectable } from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { ok } from 'assert';
import { catcher } from 'src/core/helpers/operation';

@Injectable()
export class ThresholdMediator {
  constructor(private readonly thresholdService: ThresholdService) {}

  test = () => {
    return 'ok';
  };
}
