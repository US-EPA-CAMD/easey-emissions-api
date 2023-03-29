import { IsOptional, IsString } from "class-validator";

export class MatsDerivedHourlyValueBaseDTO {
  @IsString()
  parameterCode: string;
  @IsOptional()
  @IsString()
  unadjustedHourlyValue?: string;
  @IsOptional()
  @IsString()
  modcCode?: string;
  @IsOptional()
  @IsString()
  formulaIdentifier?: string;
}

export class MatsDerivedHourlyValueRecordDTO extends MatsDerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringFormulaRecordId: string;
  calcUnadjustedHrlyValue?: string;
  calcPctDiluent?: number;
  calcPctMoisture?: number;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class MatsDerivedHourlyValueImportDTO extends MatsDerivedHourlyValueBaseDTO {}

export class MatsDerivedHourlyValueDTO extends MatsDerivedHourlyValueRecordDTO {}
