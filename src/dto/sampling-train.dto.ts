export class SamplingTrainBaseDTO {
  componentId: string;
  sorbentTrapSn: string;
  mainTrapHg?: string;
  btTrapHg?: string;
  spikeTrapHg?: string;
  spikeReferenceValue?: string;
  totalSampleVolumeDscm?: number;
  referenceSfsrRatio?: number;
  hgConcentration?: string;
  percentBreakthrough?: number;
  percentSpikeRecovery?: number;
  samplingRatioCheckResultCode?: string;
  postLeakCheckResultCode?: string;
  trainQaStatusCode?: string;
  sampleDamageExplanation?: string;
}

export class SamplingTrainRecordDTO extends SamplingTrainBaseDTO {
  id: string;
  sorbentTrapId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  calcHgConcentration?: string;
  calcPercentBreakthrough?: number;
  calcPercentSpikeRecovery?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class SamplingTrainImportDTO extends SamplingTrainBaseDTO {}

export class SamplingTrainDTO extends SamplingTrainRecordDTO {}
