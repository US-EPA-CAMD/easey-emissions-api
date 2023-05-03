import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  //add code
  samplingRatioCheckResultCode?: string;

  @IsOptional()
  @IsString()
  //add code
  postLeakCheckResultCode?: string;

  @IsOptional()
  @IsString()
 // @IsValidCode('train-qa-status-codes')
  trainQaStatusCode?: string;

  @IsOptional()
  @IsString()
  sampleDamageExplanation?: string;
}

export class SamplingTrainRecordDTO extends SamplingTrainBaseDTO {
  id: string;
  componentRecordId: string;
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
