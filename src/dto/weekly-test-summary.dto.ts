import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from './weekly-system-integrity.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { TestTypeCode } from 'src/entities/test-type-code.entity';
import { ImportCodeErrorMessage } from 'src/utils/validator.const';
import { TestResultCode } from 'src/entities/test-result-code.entity';
import { SpanScaleCode } from 'src/entities/span-scale-code.entity';

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
    message: ImportCodeErrorMessage(),
  })
  testTypeCode: string;

  @IsString()
  @IsValidCode(TestResultCode, {
    message: ImportCodeErrorMessage(),
  })
  testResultCode: string;

  @IsString()
  @IsOptional()
  @IsValidCode(SpanScaleCode, {
    message: ImportCodeErrorMessage(),
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
