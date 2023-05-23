import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { TestResultCode } from '../entities/test-result-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';

export class WeeklyTestSummaryBaseDTO {
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
  minute?: number;

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

  @IsString()
  @IsOptional()
  @IsValidCode(SpanScaleCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
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
  weeklySystemIntegrityData: WeeklySystemIntegrityImportDTO[];
}

export class WeeklyTestSummaryDTO extends WeeklyTestSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => WeeklySystemIntegrityDTO)
  weeklySystemIntegrityData: WeeklySystemIntegrityDTO[];
}
