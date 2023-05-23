import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HourlyParamFuelFlowBaseDTO {
  @IsString()
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  parameterValueForFuel?: number;

  @IsOptional()
  @IsString()
  formulaIdentifier?: string;

  @IsOptional()
  @IsString()
  sampleTypeCode?: string;

  @IsOptional()
  @IsString()
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  operatingConditionCode?: string;

  @IsOptional()
  @IsNumber()
  segmentNumber?: number;

  @IsOptional()
  @IsString()
  parameterUomCode?: string;
}

export class HourlyParamFuelFlowRecordDTO extends HourlyParamFuelFlowBaseDTO {
  id: string;
  hourlyFuelFlowId: string;
  monitoringFormulaRecordId?: string;
  calcParamValFuel?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  calcAppeStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyParamFuelFlowImportDTO extends HourlyParamFuelFlowBaseDTO {}

export class HourlyParamFuelFlowDTO extends HourlyParamFuelFlowRecordDTO {}
