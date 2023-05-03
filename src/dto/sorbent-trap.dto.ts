import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SamplingTrainDTO, SamplingTrainImportDTO } from './sampling-train.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { ModcCode } from '../entities/modc-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ApsCode } from '../entities/aps-code.entity';

export class SorbentTrapBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsDateString()
  beginDate: Date;

  @IsNumber()
  beginHour: number;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  endHour: number;

  @IsString()
  monitoringSystemId: string;

  @IsOptional()
  @IsNumber()
  pairedTrapAgreement?: number;

  @IsOptional()
  @IsNumber()
  absoluteDifferenceIndicator?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(ModcCode, {
    message: ImportCodeErrorMessage(),
  })
  modcCode?: string;

  @IsOptional()
  @IsString()
  hgSystemConcentration?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(ApsCode, {
    message: ImportCodeErrorMessage(),
  })
  apsCode?: string;

  @IsOptional()
  @IsNumber()
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
  addDate?: Date;
  updateDate?: Date;
}

export class SorbentTrapImportDTO extends SorbentTrapBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => SamplingTrainImportDTO)
  samplingTrainData: SamplingTrainImportDTO[];
}

export class SorbentTrapDTO extends SorbentTrapRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => SamplingTrainDTO)
  samplingTrainData: SamplingTrainDTO[];
}
