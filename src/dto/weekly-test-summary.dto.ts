import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';
import { COMPONENT_MONITOR_SYS_REGEX, STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';

export class WeeklyTestSummaryBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNumber()
  @Min(0)
  @Max(59)
  minute?: number;

  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId?: string;

  @IsString()
  testTypeCode: string;

  @IsString()
  testResultCode: string;

  @IsString()
  @IsOptional()
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
  addDate?: string;
  updateDate?: string;
}

export class WeeklyTestSummaryImportDTO extends WeeklyTestSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => WeeklySystemIntegrityImportDTO)
  @ArrayMaxSize(1)
  @ArrayMinSize(1)
  weeklySystemIntegrityData: WeeklySystemIntegrityImportDTO[];
}

export class WeeklyTestSummaryDTO extends WeeklyTestSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => WeeklySystemIntegrityDTO)
  @ArrayMaxSize(1)
  @ArrayMinSize(1)
  weeklySystemIntegrityData: WeeklySystemIntegrityDTO[];
}
