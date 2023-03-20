import { IsNumber, IsOptional, IsString } from "class-validator";

export class SummaryValueBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @IsString()
  parameterCode: string;
  @IsOptional()
  @IsNumber()
  currentReportingPeriodTotal?: number;
  @IsOptional()
  @IsNumber()
  ozoneSeasonToDateTotal?: number;
  @IsOptional()
  @IsNumber()
  yearToDateTotal?: number;
}

export class SummaryValueRecordDTO extends SummaryValueBaseDTO {
  @IsString()
  id: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsString()
  monitoringLocationId: string;
  @IsOptional()
  @IsNumber()
  calcCurrentRptPeriodTotal?: number;
  @IsOptional()
  @IsNumber()
  calcOsTotal?: number;
  @IsOptional()
  @IsNumber()
  calcYearTotal?: number;
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

export class SummaryValueImportDTO extends SummaryValueBaseDTO {}

export class SummaryValueDTO extends SummaryValueRecordDTO {}
