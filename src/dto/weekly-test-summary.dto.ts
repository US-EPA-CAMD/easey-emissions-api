import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';
import moment from 'moment';

export class WeeklyTestSummaryBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  @IsString()
  date: Date;
  @IsNumber()
  hour: number;
  @IsOptional()
  @IsNumber()
  minute?: number;
  @IsOptional()
  @IsString()
  componentId?: string;
  @IsString()
  testTypeCode: string;
  @IsString()
  testResultCode: string;
  @IsString()
  spanScaleCode: string;
}

export class WeeklyTestSummaryRecordDTO extends WeeklyTestSummaryBaseDTO {
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
  @IsOptional()
  @IsString()
  calcTestResultCode?: string;
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
