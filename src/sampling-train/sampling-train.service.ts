import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { SamplingTrainRepository } from './sampling-train.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';

@Injectable()
export class SamplingTrainService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: SamplingTrainRepository,
  ) {}

  async export(sorbentTrapId: string) {
    return withSlaveConnection(this.dataSource, async () => {
      return exportSamplingTrainData({
        sorbentTrapId,
        repository: this.repository,
      });
    });
  }
}
