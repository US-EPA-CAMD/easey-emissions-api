export class Nsps4tCompliancePeriodBaseDTO {
  beginYear?: number;
  beginMonth?: number;
  endYear?: number;
  endMonth?: number;
  averageCo2EmissionRate?: number;
  co2EmissionRateUomCode?: string;
  percentValidOpHours?: number;
  violationOfCo2StandardIndicator?: number;
  violationOfCo2StandardComment?: string;
}

export class Nsps4tCompliancePeriodRecordDTO extends Nsps4tCompliancePeriodBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tCompliancePeriodImportDTO extends Nsps4tCompliancePeriodBaseDTO {}

export class Nsps4tCompliancePeriodDTO extends Nsps4tCompliancePeriodRecordDTO {}
