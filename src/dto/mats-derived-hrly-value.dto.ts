export class MatsDerivedHrlyValueBaseDTO {
  parameterCode: string;
  unadjustedHourlyValue?: string;
  modcCode?: string;
  formulaIdentifier?: string;
}

export class MatsDerivedHrlyValueRecordDTO extends MatsDerivedHrlyValueBaseDTO {
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

export class MatsDerivedHrlyValueImportDTO extends MatsDerivedHrlyValueBaseDTO {}

export class MatsDerivedHrlyValueDTO extends MatsDerivedHrlyValueRecordDTO {}
