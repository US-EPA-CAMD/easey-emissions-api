import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';

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

  @IsNumber()
  @Min(0)
  @Max(9999999999)
  longTermFuelFlowValue: number;

  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  longTermFuelFlowUnitsOfMeasureCode: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999999.9)
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
  @IsNumber()
  @Min(0)
  @Max(999999999.9)
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
