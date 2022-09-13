export class LongTermFuelFlowBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  monitoringSystemId: string;
  fuelFlowPeriodCode?: string;
  longTermFuelFlowValue: number;
  longTermFuelFlowUomCode: string;
  grossCalorificValue?: number;
  gcvUnitsOfMeasureCode?: string;
  totalHeatInput?: number;
}

export class LongTermFuelFlowRecordDTO extends LongTermFuelFlowBaseDTO {
  id: string;
  reportingPeriodId?: number;
  monitoringLocationId?: string;
  monitoringSystemRecordId?: string;
  calcTotalHeatInput?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class LongTermFuelFlowImportDTO extends LongTermFuelFlowBaseDTO {}

export class LongTermFuelFlowDTO extends LongTermFuelFlowRecordDTO {}
