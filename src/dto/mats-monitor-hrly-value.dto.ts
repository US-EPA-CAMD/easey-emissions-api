export class MatsMonitorHrlyValueBaseDTO {
  parameterCode: string;
  unadjustedHourlyValue?: string;
  modcCode?: string;
  monitoringSystemId?: string;
  componentId?: string;
  percentAvailable?: number;
}

export class MatsMonitorHrlyValueRecordDTO extends MatsMonitorHrlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringLocationId?: string;
  reportingPeriodId: number;
  calcUnadjustedHrlyValue?: string;
  calcDailyCalStatus?: string;
  calcHgLineStatus?: string;
  calcHgi1Status?: string;
  calcRataStatus?: string;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class MatsMonitorHrlyValueImportDTO extends MatsMonitorHrlyValueBaseDTO {}

export class MatsMonitorHrlyValueDTO extends MatsMonitorHrlyValueRecordDTO {}
