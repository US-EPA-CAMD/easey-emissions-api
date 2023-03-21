import { IsNumber, IsOptional, IsString } from "class-validator";

export class WeeklySystemIntegrityBaseDTO {
  @IsOptional()
  @IsString()
  gasLevelCode?: string;
  @IsOptional()
  @IsNumber()
  referenceValue?: number;
  @IsOptional()
  @IsNumber()
  measuredValue?: number;
  @IsOptional()
  @IsNumber()
  apsIndicator?: number;
  @IsOptional()
  @IsNumber()
  systemIntegrityError?: number;
}

export class WeeklySystemIntegrityRecordDTO extends WeeklySystemIntegrityBaseDTO {
  @IsString()
  id: string;
  @IsString()
  weeklyTestSumId: string;
  @IsOptional()
  @IsNumber()
  calcSystemIntegrityError?: number;
  @IsOptional()
  @IsNumber()
  calcApsInd?: number;
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsString()
  addDate?: Date;
  @IsOptional()
  @IsString()
  updateDate?: Date;
  @IsNumber()
  reportingPeriodId: number;
  @IsString()
  monitoringLocationId: string;
}

export class WeeklySystemIntegrityImportDTO extends WeeklySystemIntegrityBaseDTO {}

export class WeeklySystemIntegrityDTO extends WeeklySystemIntegrityRecordDTO {}
