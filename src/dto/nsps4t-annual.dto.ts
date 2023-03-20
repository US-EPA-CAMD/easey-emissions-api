import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class Nsps4tAnnualBaseDTO {
  annualEnergySold?: number;
  annualEnergySoldTypeCode?: string;
  annualPotentialElectricOutput?: number;
}

export class Nsps4tAnnualRecordDTO extends Nsps4tAnnualBaseDTO {
  @IsString()
  id: string;
  @IsString()
  nsps4tSumId: string;
  @IsString()
  monitoringLocationId: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsString()
  userId: string;
  @IsDate()
  addDate: Date;
  @IsOptional()
  @IsDate()
  updateDate?: Date;
}

export class Nsps4tAnnualImportDTO extends Nsps4tAnnualBaseDTO {}

export class Nsps4tAnnualDTO extends Nsps4tAnnualRecordDTO {}
