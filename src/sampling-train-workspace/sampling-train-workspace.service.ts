import { Injectable } from '@nestjs/common';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';

@Injectable()
export class SamplingTrainWorkspaceService {
  constructor(private readonly repository: SamplingTrainWorkspaceRepository) {}

  async export(sorbentTrapId: string) {
    return exportSamplingTrainData({
      sorbentTrapId,
      repository: this.repository,
    });
  }
}
