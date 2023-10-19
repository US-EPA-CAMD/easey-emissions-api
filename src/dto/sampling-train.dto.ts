import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, SCIENTIFIC_NOTATION_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class SamplingTrainBaseDTO {
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  sorbentTrapSN: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  mainTrapHg?: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  btTrapHg?: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  spikeTrapHg?: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  spikeReferenceValue?: string;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 9999999999.9999)
  totalSampleVolumeDSCM?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999.9, 999.9)
  referenceSFSRRatio?: number;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  hgConcentration?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-10000.0, 10000.0)
  percentBreakthrough?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999.9, 999.9)
  percentSpikeRecovery?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(TestResultCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  samplingRatioCheckResultCode?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(TestResultCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  postLeakCheckResultCode?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(TrainQaStatusCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  trainQAStatusCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(1000)
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
  addDate?: string;
  updateDate?: string;
}

export class SamplingTrainImportDTO extends SamplingTrainBaseDTO {}

export class SamplingTrainDTO extends SamplingTrainRecordDTO {}
