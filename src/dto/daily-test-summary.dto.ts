import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import moment from 'moment';
import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from './daily-calibration.dto';

export class DailyTestSummaryBaseDTO {
  stackPipeId?: string;

  unitId?: string;

  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  date: Date;

  hour: number;

  minute: number;

  monitoringSystemId?: string;

  componentId?: string;

  testTypeCode: string;

  testResultCode: string;

  spanScaleCode?: string;
}

export class DailyTestSummaryRecordDTO extends DailyTestSummaryBaseDTO {
  id: string;

  reportingPeriodId: number;

  monitoringLocationId: string;

  monitoringSystemRecordId?: string;

  componentRecordId?: string;

  calcTestResultCode: string;

  userId?: string;

  addDate?: Date;

  updateDate?: Date;
}

export class DailyTestSummaryImportDTO extends DailyTestSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyCalibrationImportDTO)
  dailyCalibrationData: DailyCalibrationImportDTO[];
}

export class DailyTestSummaryDTO extends DailyTestSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyCalibrationDTO)
  dailyCalibrationData: DailyCalibrationDTO[];
}
