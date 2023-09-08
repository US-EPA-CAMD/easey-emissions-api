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
import { SampleTypeCode } from '../entities/sample-type-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';
import { COMPONENT_MONITOR_SYS_REGEX, FORMULA_ID_REGEX } from '../constants/regex-list';

export class HourlyParamFuelFlowBaseDTO {
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
  @Max(99999999.99999)
  parameterValueForFuel?: number;

  @IsOptional()
  @IsString()
  @Matches(FORMULA_ID_REGEX)
  formulaId?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(SampleTypeCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  sampleTypeCode?: string;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(OperatingConditionCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  operatingConditionCode?: string;

  @IsOptional()
  @IsNumber()
  segmentNumber?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterUnitsOfMeasureCode?: string;
}

export class HourlyParamFuelFlowRecordDTO extends HourlyParamFuelFlowBaseDTO {
  id: string;
  hourlyFuelFlowId: string;
  monitoringFormulaRecordId?: string;
  calcParamValFuel?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  calcAppeStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyParamFuelFlowImportDTO extends HourlyParamFuelFlowBaseDTO {}

export class HourlyParamFuelFlowDTO extends HourlyParamFuelFlowRecordDTO {}
