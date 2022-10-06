import { Injectable } from '@nestjs/common';
import { SamplingTrainRepository } from './sampling-train.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';

@Injectable()
export class SamplingTrainService {
  constructor(private readonly repository: SamplingTrainRepository) {}

  async export(sorbentTrapId: string) {
    return exportSamplingTrainData({
      sorbentTrapId,
      repository: this.repository,
    });
  }
}
