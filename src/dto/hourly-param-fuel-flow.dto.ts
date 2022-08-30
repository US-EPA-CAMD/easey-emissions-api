export class HourlyParamFuelFlowBaseDTO {
  parameterCode: string;
  parameterValueForFuel?: number;
  formulaIdentifier?: string;
  sampleTypeCode?: string;
  monitoringSystemId?: string;
  operatingConditionCode?: string;
  segmentNumber?: number;
  parameterUomCode?: string;
}

export class HourlyParamFuelFlowRecordDTO extends HourlyParamFuelFlowBaseDTO {
  id: string;
  hourlyFuelFlowId: string;
  calcParamValFuel?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcAppeStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyParamFuelFlowImportDTO extends HourlyParamFuelFlowBaseDTO {}

export class HourlyParamFuelFlowDTO extends HourlyParamFuelFlowRecordDTO {}
