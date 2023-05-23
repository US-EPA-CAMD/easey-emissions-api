import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from './daily-calibration.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { TestResultCode } from '../entities/test-result-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';

export class DailyTestSummaryBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  hour: number;

  @IsNumber()
  @IsOptional()
  minute: number;

  @IsOptional()
  @IsString()
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsString()
  @IsValidCode(TestTypeCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  testTypeCode: string;

  @IsString()
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  testResultCode: string;

  @IsOptional()
  @IsString()
  @IsValidCode(SpanScaleCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
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
