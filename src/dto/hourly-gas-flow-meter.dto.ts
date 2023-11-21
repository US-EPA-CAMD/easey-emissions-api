import { IsNumber, IsOptional, IsString, Matches, } from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class HourlyGasFlowMeterBaseDTO {
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId: string;

  @IsOptional()
  @IsString()
  // @DbLookup(
  //   BeginEndHourFlag,
  //   (args: ValidationArguments): FindOneOptions<BeginEndHourFlag> => {
  //     return { where: { id: args.value } };
  //   },
  //   {
  //     message: (args: ValidationArguments) => {
  //       return `${args.property} has an invalid value of ${args.value}`;
  //     },
  //   },
  // )
  beginEndHourFlag?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2}, {message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.99, 9999999999.99)
  hourlyGFMReading?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2}, {message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.99, 9999999999.99)
  averageHourlySamplingRate?: number;

  @IsOptional()
  @IsString()
  samplingRateUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1}, {message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-999.9, 999.9)
  hourlySFSRRatio?: number;
}

export class HourlyGasFlowMeterRecordDTO extends HourlyGasFlowMeterBaseDTO {
  id: string;
  hourId: string;
  componentRecordId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  calcFlowToSamplingRatio?: number;
  calcFlowToSamplingMult?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class HourlyGasFlowMeterImportDTO extends HourlyGasFlowMeterBaseDTO {}

export class HourlyGasFlowMeterDTO extends HourlyGasFlowMeterRecordDTO {}
