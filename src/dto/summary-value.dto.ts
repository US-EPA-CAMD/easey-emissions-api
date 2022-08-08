export class SummaryValueBaseDTO {
  parameterCode: string;
  currentReportingPeriodTotal?: number;
  ozoneSeasonToDateTotal?: number;
  yearToDateTotal?: number;
}

export class SummaryValueRecordDTO extends SummaryValueBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcCurrentRptPeriodTotal?: number;
  calcOsTotal?: number;
  calcYearTotal?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class SummaryValueImportDTO extends SummaryValueBaseDTO {}

export class SummaryValueDTO extends SummaryValueRecordDTO {}
