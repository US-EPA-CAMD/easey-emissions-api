import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, SCIENTIFIC_NOTATION_REGEX } from '../constants/regex-list';

export class MatsMonitorHourlyValueBaseDTO {
  @IsString()
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  unadjustedHourlyValue?: string;

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
}

export class MatsMonitorHourlyValueRecordDTO extends MatsMonitorHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringLocationId?: string;
  reportingPeriodId: number;
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
  calcUnadjustedHrlyValue?: string;
  calcDailyCalStatus?: string;
  calcHgLineStatus?: string;
  calcHgi1Status?: string;
  calcRataStatus?: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class MatsMonitorHourlyValueImportDTO extends MatsMonitorHourlyValueBaseDTO {}

export class MatsMonitorHourlyValueDTO extends MatsMonitorHourlyValueRecordDTO {}
