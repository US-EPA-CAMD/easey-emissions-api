import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsDateString,
  Matches,
  IsIn,
ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SamplingTrainDTO, SamplingTrainImportDTO } from './sampling-train.dto';
import { COMPONENT_MONITOR_SYS_REGEX, SCIENTIFIC_NOTATION_REGEX, STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class SorbentTrapBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsDateString()
  beginDate: Date;

  @IsNumber()
  @IsInRange(0, 23)
  beginHour: number;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  @IsInRange(0, 23)
  endHour: number;

  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId: string;

  @IsOptional()
  @IsNumber( { maxDecimalPlaces: 2 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-999.99, 999.99)
  pairedTrapAgreement?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  absoluteDifferenceIndicator?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(ModcCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  modcCode?: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  hgSystemConcentration?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(ApsCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  apsCode?: string;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  rataIndicator?: number;
}

export class SorbentTrapRecordDTO extends SorbentTrapBaseDTO {
  id: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  monitoringSystemRecordId: string;
  calcPairedTrapAgreement?: number;
  calcModcCode?: string;
  calcHgConcentration?: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class SorbentTrapImportDTO extends SorbentTrapBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => SamplingTrainImportDTO)
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  samplingTrainData: SamplingTrainImportDTO[];
}

export class SorbentTrapDTO extends SorbentTrapRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => SamplingTrainDTO)
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  samplingTrainData: SamplingTrainDTO[];
}
