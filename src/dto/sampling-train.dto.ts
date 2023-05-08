import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { TestResultCode } from '../entities/test-result-code.entity';
import { TrainQaStatusCode } from '../entities/train-qa-status-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

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
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  samplingRatioCheckResultCode?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  postLeakCheckResultCode?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(TrainQaStatusCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  trainQAStatusCode?: string;

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
