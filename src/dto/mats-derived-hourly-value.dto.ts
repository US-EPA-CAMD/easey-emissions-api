export class MatsDerivedHourlyValueBaseDTO {
  parameterCode: string;
  unadjustedHourlyValue?: string;
  modcCode?: string;
  formulaIdentifier?: string;
}

export class MatsDerivedHourlyValueRecordDTO extends MatsDerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  calcUnadjustedHrlyValue?: string;
  calcPctDiluent?: number;
  calcPctMoisture?: number;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class MatsDerivedHourlyValueImportDTO extends MatsDerivedHourlyValueBaseDTO {}

export class MatsDerivedHourlyValueDTO extends MatsDerivedHourlyValueRecordDTO {}
