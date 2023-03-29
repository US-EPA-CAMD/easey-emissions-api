import { IsNumber, IsOptional, IsString } from "class-validator";

export class DerivedHourlyValueBaseDTO {
  @IsString()
  parameterCode: string;
  @IsNumber()
  @IsOptional()
  unadjustedHourlyValue: number;
  @IsNumber()
  @IsOptional()
  adjustedHourlyValue: number;
  @IsString()
  @IsOptional()
  modcCode: string;
  @IsString()
  @IsOptional()
  monitoringSystemId: string;
  @IsString()
  @IsOptional()
  formulaIdentifier: string;
  @IsNumber()
  @IsOptional()
  percentAvailable: number;
  @IsString()
  @IsOptional()
  operatingConditionCode: string;
  @IsNumber()
  @IsOptional()
  segmentNumber: number;
  @IsString()
  @IsOptional()
  fuelCode: string;
}

export class DerivedHourlyValueRecordDTO extends DerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId: string;
  monitoringFormulaRecordId: string;
  biasAdjustmentFactor: number;
  calcUnadjustedHrlyValue: number;
  calcAdjustedHrlyValue: number;
  diluentCapInd: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  calcPctDiluent: string;
  calcPctMoisture: string;
  calcRataStatus: string;
  calcAppeStatus: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcFuelFlowTotal: number;
  calcHourMeasureCode: string;
}

export class DerivedHourlyValueImportDTO extends DerivedHourlyValueBaseDTO {}

export class DerivedHourlyValueDTO extends DerivedHourlyValueRecordDTO {}
