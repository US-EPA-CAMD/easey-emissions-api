import { IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SamplingTrainDTO, SamplingTrainImportDTO } from './sampling-train.dto';
import moment from 'moment';

export class SorbentTrapBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @IsString()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  beginDate: Date;
  @IsNumber()
  beginHour: number;
  @IsString()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
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
  modcCode?: string;
  @IsOptional()
  @IsString()
  hgSystemConcentration?: string;
  @IsOptional()
  @IsString()
  apsCode?: string;
  @IsOptional()
  @IsNumber()
  rataIndicator?: number;
}

export class SorbentTrapRecordDTO extends SorbentTrapBaseDTO {
  @IsString()
  id: string;
  @IsString()
  monitoringLocationId: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsOptional()
  @IsString()
  monitoringSystemRecordId: string;
  @IsNumber()
  calcPairedTrapAgreement?: number;
  @IsOptional()
  @IsString()
  calcModcCode?: string;
  @IsOptional()
  @IsString()
  calcHgConcentration?: string;
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsString()
  addDate?: Date;
  @IsOptional()
  @IsString()
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
