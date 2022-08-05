export class HrlyParamFuelFlowBaseDTO {
  parameterCode: string;
  parameterValueForFuel?: number;
  formulaIdentifier?: string;
  sampleTypeCode?: string;
  monitoringSystemId?: string;
  operatingConditionCode?: string;
  segmentNumber?: number;
  parameterUomCode?: string;
}

export class HrlyParamFuelFlowRecordDTO extends HrlyParamFuelFlowBaseDTO {
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

export class HrlyParamFuelFlowImportDTO extends HrlyParamFuelFlowBaseDTO {}

export class HrlyParamFuelFlowDTO extends HrlyParamFuelFlowRecordDTO {}
