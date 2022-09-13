import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SamplingTrainDTO, SamplingTrainImportDTO } from './sampling-train.dto';

export class SorbentTrapBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  monitoringSystemId: string;
  pairedTrapAgreement?: number;
  absoluteDifferenceIndicator?: number;
  modcCode?: string;
  hgSystemConcentration?: string;
  apsCode?: string;
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
