import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class SummaryValueBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
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
  currentReportingPeriodTotal?: number;

  @IsOptional()
  @IsNumber()
  ozoneSeasonToDateTotal?: number;

  @IsOptional()
  @IsNumber()
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
