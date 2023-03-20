import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import moment from 'moment';
import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from './daily-calibration.dto';

export class DailyTestSummaryBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsString()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  date: Date;

  @IsNumber()
  hour: number;

  @IsNumber()
  minute: number;

  @IsOptional()
  @IsString()
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsString()
  testTypeCode: string;
  
  @IsString()
  testResultCode: string;

  @IsOptional()
  @IsString()
  spanScaleCode?: string;
}

export class DailyTestSummaryRecordDTO extends DailyTestSummaryBaseDTO {
  @IsString()
  id: string;

  @IsNumber()
  reportingPeriodId: number;

  @IsString()
  monitoringLocationId: string;

  @IsOptional()
  @IsString()
  monitoringSystemRecordId?: string;

  @IsOptional()
  @IsString()
  componentRecordId?: string;

  @IsString()
  calcTestResultCode: string;

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
