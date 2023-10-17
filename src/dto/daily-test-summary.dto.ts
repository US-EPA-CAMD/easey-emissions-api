import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from './daily-calibration.dto';
import { COMPONENT_MONITOR_SYS_REGEX, STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange, IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';

export class DailyTestSummaryBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsIsoFormat()
  @IsValidDate()
  date: Date;

  @IsNumber()
  @IsInRange(0, 23)
  hour: number;

  @IsNumber()
  @IsOptional()
  @IsInRange(0, 59)
  minute: number;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId?: string;

  @IsString()
  // @IsValidCode(TestTypeCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  testTypeCode: string;

  @IsString()
  // @IsValidCode(TestResultCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  testResultCode: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(SpanScaleCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
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
  addDate?: string;
  updateDate?: string;
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
