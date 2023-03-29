import { IsNumber, IsOptional, IsString } from "class-validator";

export class MonitorHourlyValueBaseDTO {
  @IsString()
  parameterCode: string;
  @IsOptional()
  @IsNumber()
  unadjustedHourlyValue?: number;
  @IsOptional()
  @IsNumber()
  adjustedHourlyValue?: number;
  @IsOptional()
  @IsString()
  modcCode?: string;
  @IsOptional()
  @IsString()
  monitoringSystemId?: string;
  @IsOptional()
  @IsString()
  componentId?: string;
  @IsOptional()
  @IsNumber()
  percentAvailable?: number;
  @IsOptional()
  @IsString()
  moistureBasis?: string;
}

export class MonitorHourlyValueRecordDTO extends MonitorHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
  biasAdjustmentFactor?: number;
  calcAdjustedHrlyValue?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcLineStatus?: string;
  calcRataStatus?: string;
  calcDaycalStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcLeakStatus?: string;
  calcDayintStatus?: string;
  calcF2lStatus?: string;
}

export class MonitorHourlyValueImportDTO extends MonitorHourlyValueBaseDTO {}

export class MonitorHourlyValueDTO extends MonitorHourlyValueRecordDTO {}
