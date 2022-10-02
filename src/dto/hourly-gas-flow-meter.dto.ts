export class HourlyGasFlowMeterBaseDTO {
  componentId: string;
  beginEndHourFlag?: string;
  hourlyGfmReading?: number;
  avgHourlySamplingRate?: number;
  samplingRateUom?: string;
  hourlySfsrRatio?: number;
}

export class HourlyGasFlowMeterRecordDTO extends HourlyGasFlowMeterBaseDTO {
  id: string;
  hourId: string;
  componentRecordId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  calcFlowToSamplingRatio?: number;
  calcFlowToSamplingMult?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class HourlyGasFlowMeterImportDTO extends HourlyGasFlowMeterBaseDTO {}

export class HourlyGasFlowMeterDTO extends HourlyGasFlowMeterRecordDTO {}
