import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { SampleTypeCode } from '../entities/sample-type-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';

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
  parameterValueForFuel?: number;

  @IsOptional()
  @IsString()
  formulaIdentifier?: string;

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
  parameterUomCode?: string;
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
