import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Nsps4tAnnualBaseDTO {
  @IsOptional()
  @IsNumber()
  annualEnergySold?: number;

  @IsOptional()
  @IsString()
  annualEnergySoldTypeCode?: string;

  @IsOptional()
  @IsNumber()
  annualPotentialElectricOutput?: number;
}

export class Nsps4tAnnualRecordDTO extends Nsps4tAnnualBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tAnnualImportDTO extends Nsps4tAnnualBaseDTO {}

export class Nsps4tAnnualDTO extends Nsps4tAnnualRecordDTO {}
