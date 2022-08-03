export class DerivedHourlyValueBaseDTO {
  parameterCode: string;
  unadjustedHourlyValue: number;
  adjustedHourlyValue: number;
  modccode: string;
  monitoringSystemId: string;
  formulaIdentifier: string;
  percentAvailable: number;
  operatingConditionCode: string;
  segmentNumber: number;
  fuelCode: string;
}

export class DerivedHourlyValueRecordDTO extends DerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  applicableBiasAdjFactor: number;
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
  rptPeriodId: number;
  monLocId: string;
  calcFuelFlowTotal: number;
  calcHourMeasureCode: string;
}

export class DerivedHourlyValueImportDTO extends DerivedHourlyValueBaseDTO {}

export class DerivedHourlyValueDTO extends DerivedHourlyValueRecordDTO {}
