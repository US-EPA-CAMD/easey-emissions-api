import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidationArguments,
} from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';

export class SummaryValueBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsString()
  @IsValidCode(ParameterCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999999.999)
  currentReportingPeriodTotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999999.999)
  ozoneSeasonToDateTotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999999.999)
  yearToDateTotal?: number;
}

export class SummaryValueRecordDTO extends SummaryValueBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcCurrentRptPeriodTotal?: number;
  calcOsTotal?: number;
  calcYearTotal?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class SummaryValueImportDTO extends SummaryValueBaseDTO {}

export class SummaryValueDTO extends SummaryValueRecordDTO {}
