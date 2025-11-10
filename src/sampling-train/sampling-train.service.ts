import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { SamplingTrainRepository } from './sampling-train.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';

@Injectable()
export class SamplingTrainService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async export(sorbentTrapId: string) {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const samplingTrainRepository = new SamplingTrainRepository(replicaManager);
      return exportSamplingTrainData({
        sorbentTrapId,
        repository: samplingTrainRepository,
      });
    });
  }
}
