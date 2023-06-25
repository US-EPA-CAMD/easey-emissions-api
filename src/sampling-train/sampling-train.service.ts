import { Injectable } from '@nestjs/common';
import { SamplingTrainRepository } from './sampling-train.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';
import { SamplingTrainDTO } from 'src/dto/sampling-train.dto';

@Injectable()
export class SamplingTrainService {

  constructor(private readonly repository: SamplingTrainRepository) {}

  async export(sorbentTrapId: string) {
    return exportSamplingTrainData({
      sorbentTrapId,
      repository: this.repository,
    });
  }

  async removeNonReportedValues(samplingTrainData: SamplingTrainDTO[]) {
    samplingTrainData.forEach(dto => {
      delete dto.id;
      delete dto.sorbentTrapId;
      delete dto.reportingPeriodId;
      delete dto.componentRecordId;
      delete dto.monitoringLocationId;
      delete dto.calcHgConcentration;
      delete dto.calcPercentBreakthrough;
      delete dto.calcPercentSpikeRecovery;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
