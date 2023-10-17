import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, FORMULA_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class HourlyParamFuelFlowBaseDTO {
  @IsString()
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  @IsInRange(-99999999.99999, 99999999.99999)
  parameterValueForFuel?: number;

  @IsOptional()
  @IsString()
  @Matches(FORMULA_ID_REGEX)
  formulaId?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(SampleTypeCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  sampleTypeCode?: string;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(OperatingConditionCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  operatingConditionCode?: string;

  @IsOptional()
  @IsNumber()
  segmentNumber?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
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
