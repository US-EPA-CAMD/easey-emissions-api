import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Nsps4tCompliancePeriodDTO,
  Nsps4tCompliancePeriodImportDTO,
} from './nsps4t-compliance-period.dto';
import { Nsps4tAnnualDTO, Nsps4tAnnualImportDTO } from './nsps4t-annual.dto';

export class Nsps4tSummaryBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  co2EmissionStandardCode?: string;

  @IsOptional()
  @IsNumber()
  modusValue?: number;

  @IsOptional()
  @IsString()
  modusUomCode?: string;

  @IsOptional()
  @IsString()
  electricalLoadCode?: string;

  @IsOptional()
  @IsNumber()
  noCompliancePeriodEndedIndicator?: number;

  @IsOptional()
  @IsString()
  noCompliancePeriodEndedComment?: string;
}

export class Nsps4tSummaryRecordDTO extends Nsps4tSummaryBaseDTO {
  id: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
}

export class Nsps4tSummaryImportDTO extends Nsps4tSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodImportDTO)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualImportDTO)
  nsps4tFourthQuarterData: Nsps4tAnnualImportDTO[];
}

export class Nsps4tSummaryDTO extends Nsps4tSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodDTO)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualDTO)
  nsps4tFourthQuarterData: Nsps4tAnnualDTO[];
}
