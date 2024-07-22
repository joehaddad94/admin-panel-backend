import { Injectable } from '@nestjs/common';
import { ThresholdService } from './threshold.service';

@Injectable()
export class ThresholdMediator {
  constructor(private readonly thresholdService: ThresholdService) {}

  test = () => {
    return 'ok';
  };
}
