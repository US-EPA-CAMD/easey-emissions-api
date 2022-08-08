export class HrlyGasFlowMeterBaseDTO {
  componentId: string;
  beginEndHourFlag?: string;
  hourlyGfmReading?: number;
  avgHourlySamplingRate?: number;
  samplingRateUom?: string;
  hourlySfsrRatio?: number;
}

export class HrlyGasFlowMeterRecordDTO extends HrlyGasFlowMeterBaseDTO {
  id: string;
  hourId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  calcFlowToSamplingRatio?: number;
  calcFlowToSamplingMult?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class HrlyGasFlowMeterImportDTO extends HrlyGasFlowMeterBaseDTO {}

export class HrlyGasFlowMeterDTO extends HrlyGasFlowMeterRecordDTO {}
