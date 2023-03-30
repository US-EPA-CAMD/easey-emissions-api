import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Nsps4tCompliancePeriodBaseDTO {
  @IsOptional()
  @IsNumber()
  beginYear?: number;

  @IsOptional()
  @IsNumber()
  beginMonth?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsNumber()
  endMonth?: number;

  @IsOptional()
  @IsNumber()
  averageCo2EmissionRate?: number;

  @IsOptional()
  @IsString()
  co2EmissionRateUomCode?: string;

  @IsOptional()
  @IsNumber()
  percentValidOpHours?: number;

  @IsOptional()
  @IsNumber()
  violationOfCo2StandardIndicator?: number;

  @IsOptional()
  @IsString()
  violationOfCo2StandardComment?: string;
}

export class Nsps4tCompliancePeriodRecordDTO extends Nsps4tCompliancePeriodBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tCompliancePeriodImportDTO extends Nsps4tCompliancePeriodBaseDTO {}

export class Nsps4tCompliancePeriodDTO extends Nsps4tCompliancePeriodRecordDTO {}
