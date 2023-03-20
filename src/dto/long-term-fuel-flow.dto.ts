import { IsNumber, IsOptional, IsString } from "class-validator";

export class LongTermFuelFlowBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @IsString()
  monitoringSystemId: string;
  @IsOptional()
  @IsString()
  fuelFlowPeriodCode?: string;
  @IsNumber()
  longTermFuelFlowValue: number;
  @IsString()
  longTermFuelFlowUomCode: string;
  @IsOptional()
  @IsNumber()
  grossCalorificValue?: number;
  @IsOptional()
  @IsString()
  gcvUnitsOfMeasureCode?: string;
  @IsOptional()
  @IsNumber()
  totalHeatInput?: number;
}

export class LongTermFuelFlowRecordDTO extends LongTermFuelFlowBaseDTO {
  id: string;
  @IsOptional()
  @IsNumber()
  reportingPeriodId?: number;
  @IsOptional()
  @IsString()
  monitoringLocationId?: string;
  @IsOptional()
  @IsString()
  monitoringSystemRecordId?: string;
  @IsOptional()
  @IsNumber()
  calcTotalHeatInput?: number;
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsString()
  addDate?: Date;
  @IsOptional()
  @IsString()
  updateDate?: Date;
}

export class LongTermFuelFlowImportDTO extends LongTermFuelFlowBaseDTO {}

export class LongTermFuelFlowDTO extends LongTermFuelFlowRecordDTO {}
