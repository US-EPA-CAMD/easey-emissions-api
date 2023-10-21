import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

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
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.999, 9999999999.999)
  currentReportingPeriodTotal?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.999, 9999999999.999)
  ozoneSeasonToDateTotal?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.999, 9999999999.999)
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
