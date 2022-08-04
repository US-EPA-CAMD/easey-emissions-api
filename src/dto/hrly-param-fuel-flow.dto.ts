export class HourlyParameterFuelFlowBaseDTO {
  parameterCode: string;
  parameterValueForFuel?: number;
  formulaIdentifier?: string;
  sampleTypeCode?: string;
  monitoringSystemId?: string;
  operatingConditionCode?: string;
  segmentNumber?: number;
  parameterUomCode?: string;
}

export class HourlyParameterFuelFlowRecordDTO extends HourlyParameterFuelFlowBaseDTO {
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

export class HourlyParameterFuelFlowImportDTO extends HourlyParameterFuelFlowBaseDTO {}

export class HourlyParameterFuelFlowDTO extends HourlyParameterFuelFlowRecordDTO {}
