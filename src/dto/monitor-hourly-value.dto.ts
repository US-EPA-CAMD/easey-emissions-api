import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX } from '../constants/regex-list';

export class MonitorHourlyValueBaseDTO {
  @IsString()
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  @Min(-9999999999.9999)
  @Max(9999999999.9999)
  unadjustedHourlyValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999999.9999)
  adjustedHourlyValue?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(ModcCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  modcCode?: string;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.9)
  percentAvailable?: number;

  @IsOptional()
  @IsString()
  moistureBasis?: string;
}

export class MonitorHourlyValueRecordDTO extends MonitorHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
  biasAdjustmentFactor?: number;
  calcAdjustedHrlyValue?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  calcLineStatus?: string;
  calcRataStatus?: string;
  calcDaycalStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcLeakStatus?: string;
  calcDayintStatus?: string;
  calcF2lStatus?: string;
}

export class MonitorHourlyValueImportDTO extends MonitorHourlyValueBaseDTO {}

export class MonitorHourlyValueDTO extends MonitorHourlyValueRecordDTO {}
