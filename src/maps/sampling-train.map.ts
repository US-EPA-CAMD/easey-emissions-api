import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SamplingTrain } from '../entities/sampling-train.entity';
import { SamplingTrain as SamplingTrainWorkspace } from '../entities/workspace/sampling-train.entity';
import { SamplingTrainDTO } from '../dto/sampling-train.dto';

@Injectable()
export class SamplingTrainMap extends BaseMap<
  SamplingTrain | SamplingTrainWorkspace,
  SamplingTrainDTO
> {
  public async one(
    entity: SamplingTrain | SamplingTrainWorkspace,
  ): Promise<SamplingTrainDTO> {
    return {
      id: entity.id,
      componentId: entity.component?.componentId ?? null,
      componentRecordId: entity.componentId,
      sorbentTrapId: entity.sorbentTrapId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      sorbentTrapSn: entity.sorbentTrapSn,
      mainTrapHg: entity.mainTrapHg,
      btTrapHg: entity.btTrapHg,
      spikeTrapHg: entity.spikeTrapHg,
      spikeReferenceValue: entity.spikeReferenceValue,
      totalSampleVolumeDscm: entity.totalSampleVolumeDscm,
      referenceSfsrRatio: entity.referenceSfsrRatio,
      hgConcentration: entity.hgConcentration,
      percentBreakthrough: entity.percentBreakthrough,
      percentSpikeRecovery: entity.percentSpikeRecovery,
      samplingRatioCheckResultCode: entity.samplingRatioCheckResultCode,
      postLeakCheckResultCode: entity.postLeakCheckResultCode,
      trainQAStatusCode: entity.trainQAStatusCode,
      sampleDamageExplanation: entity.sampleDamageExplanation,
      calcHgConcentration: entity.calcHgConcentration,
      calcPercentBreakthrough: entity.calcPercentBreakthrough,
      calcPercentSpikeRecovery: entity.calcPercentSpikeRecovery,
    };
  }
}
