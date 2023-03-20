import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class SamplingTrainBaseDTO {
  @IsString()
  componentId: string;
  @IsString()
  sorbentTrapSn: string;
  @IsOptional()
  @IsString()
  mainTrapHg?: string;
  @IsOptional()
  @IsString()
  btTrapHg?: string;
  @IsOptional()
  @IsString()
  spikeTrapHg?: string;
  @IsOptional()
  @IsString()
  spikeReferenceValue?: string;
  @IsOptional()
  @IsNumber()
  totalSampleVolumeDscm?: number;
  @IsOptional()
  @IsNumber()
  referenceSfsrRatio?: number;
  @IsOptional()
  @IsString()
  hgConcentration?: string;
  @IsOptional()
  @IsNumber()
  percentBreakthrough?: number;
  @IsOptional()
  @IsNumber()
  percentSpikeRecovery?: number;
  @IsOptional()
  @IsString()
  samplingRatioCheckResultCode?: string;
  @IsOptional()
  @IsString()
  postLeakCheckResultCode?: string;
  @IsOptional()
  @IsString()
  trainQaStatusCode?: string;
  @IsOptional()
  @IsString()
  sampleDamageExplanation?: string;
}

export class SamplingTrainRecordDTO extends SamplingTrainBaseDTO {
  @IsString()
  id: string;
  @IsString()
  componentRecordId: string;
  @IsString()
  sorbentTrapId: string;
  @IsString()
  monitoringLocationId: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsOptional()
  @IsString()
  calcHgConcentration?: string;
  @IsOptional()
  @IsNumber()
  calcPercentBreakthrough?: number;
  @IsOptional()
  @IsNumber()
  calcPercentSpikeRecovery?: number;
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsDate()
  addDate?: Date;
  @IsOptional()
  @IsDate()
  updateDate?: Date;
}

export class SamplingTrainImportDTO extends SamplingTrainBaseDTO {}

export class SamplingTrainDTO extends SamplingTrainRecordDTO {}
