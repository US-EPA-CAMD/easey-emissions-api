import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  Nsps4tCompliancePeriodDTO,
  Nsps4tCompliancePeriodImportDTO,
} from './nsps4t-compliance-period.dto';
import { Nsps4tAnnualDTO, Nsps4tAnnualImportDTO } from './nsps4t-annual.dto';

export class Nsps4tSummaryBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  co2EmissionStandardCode?: string;
  modusValue?: number;
  modusUomCode?: string;
  electricalLoadCode?: string;
  noCompliancePeriodEndedIndicator?: number;
  noCompliancePeriodEndedComment?: string;
}

export class Nsps4tSummaryRecordDTO extends Nsps4tSummaryBaseDTO {
  id: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tSummaryImportDTO extends Nsps4tSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodImportDTO)
  nsps4TcompliancePeriodData: Nsps4tCompliancePeriodImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualImportDTO)
  nsps4TfourthQuarterData: Nsps4tAnnualImportDTO[];
}

export class Nsps4tSummaryDTO extends Nsps4tSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodDTO)
  nsps4TcompliancePeriodData: Nsps4tCompliancePeriodDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualDTO)
  nsps4TfourthQuarterData: Nsps4tAnnualDTO[];
}
