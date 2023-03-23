import { IsNumber, IsString } from "class-validator";

export class DerivedHourlyValueBaseDTO {
  @IsString()
  parameterCode: string;
  @IsNumber()
  unadjustedHourlyValue: number;
  @IsNumber()
  adjustedHourlyValue: number;
  @IsString()
  modcCode: string;
  @IsString()
  monitoringSystemId: string;
  @IsString()
  formulaIdentifier: string;
  @IsNumber()
  percentAvailable: number;
  @IsString()
  operatingConditionCode: string;
  @IsNumber()
  segmentNumber: number;
  @IsString()
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
