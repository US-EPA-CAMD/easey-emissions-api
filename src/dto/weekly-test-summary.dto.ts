import { ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';
import moment from 'moment';

export class WeeklyTestSummaryBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
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
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
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
