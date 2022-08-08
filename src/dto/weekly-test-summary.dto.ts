import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';

export class WeeklyTestSummaryBaseDTO {
  date: Date;
  hour: number;
  minute?: number;
  componentId?: string;
  testTypeCode: string;
  testResultCode: string;
  spanScaleCode: string;
}

export class WeeklyTestSummaryRecordDTO extends WeeklyTestSummaryBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  monitoringSystemId?: string;
  calcTestResultCode?: string;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
}

export class WeeklyTestSummaryImportDTO extends WeeklyTestSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => WeeklySystemIntegrityImportDTO)
  weeklySystemIntegrityData: WeeklySystemIntegrityImportDTO[];
}

export class WeeklyTestSummaryDTO extends WeeklyTestSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => WeeklySystemIntegrityDTO)
  weeklySystemIntegrityData: WeeklySystemIntegrityDTO[];
}
