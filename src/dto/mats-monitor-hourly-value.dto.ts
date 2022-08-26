export class MatsMonitorHourlyValueBaseDTO {
  parameterCode: string;
  unadjustedHourlyValue?: string;
  modcCode?: string;
  monitoringSystemId?: string;
  componentId?: string;
  percentAvailable?: number;
}

export class MatsMonitorHourlyValueRecordDTO extends MatsMonitorHourlyValueBaseDTO {
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

export class MatsMonitorHourlyValueImportDTO extends MatsMonitorHourlyValueBaseDTO {}

export class MatsMonitorHourlyValueDTO extends MatsMonitorHourlyValueRecordDTO {}
