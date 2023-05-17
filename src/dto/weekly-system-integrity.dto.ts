import { IsNumber, IsString } from 'class-validator';

export class WeeklySystemIntegrityBaseDTO {
  @IsString()
  gasLevelCode?: string;

  @IsNumber()
  referenceValue?: number;

  @IsNumber()
  measuredValue?: number;

  @IsNumber()
  apsIndicator?: number;

  @IsNumber()
  systemIntegrityError?: number;
}

export class WeeklySystemIntegrityRecordDTO extends WeeklySystemIntegrityBaseDTO {
  id: string;
  weeklyTestSumId: string;
  calcSystemIntegrityError?: number;
  calcApsInd?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class WeeklySystemIntegrityImportDTO extends WeeklySystemIntegrityBaseDTO {}

export class WeeklySystemIntegrityDTO extends WeeklySystemIntegrityRecordDTO {}
