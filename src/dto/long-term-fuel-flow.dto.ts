import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class LongTermFuelFlowBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(FuelFlowPeriodCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  fuelFlowPeriodCode?: string;

  @IsNumber({ maxDecimalPlaces: 0}, { message: ErrorMessages.MaxDecimalPlaces })
  longTermFuelFlowValue: number;

  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  longTermFuelFlowUnitsOfMeasureCode: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1}, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999999999.9, 999999999.9)
  grossCalorificValue?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  gcvUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0}, { message: ErrorMessages.MaxDecimalPlaces })
  totalHeatInput?: number;
}

export class LongTermFuelFlowRecordDTO extends LongTermFuelFlowBaseDTO {
  id: string;
  reportingPeriodId?: number;
  monitoringLocationId?: string;
  monitoringSystemRecordId?: string;
  calcTotalHeatInput?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class LongTermFuelFlowImportDTO extends LongTermFuelFlowBaseDTO {}

export class LongTermFuelFlowDTO extends LongTermFuelFlowRecordDTO {}
