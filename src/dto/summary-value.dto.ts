import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcCurrentRptPeriodTotal?: number;
  calcOsTotal?: number;
  calcYearTotal?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class SummaryValueImportDTO extends SummaryValueBaseDTO {}

export class SummaryValueDTO extends SummaryValueRecordDTO {}
