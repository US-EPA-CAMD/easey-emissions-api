import { IsNumber, IsOptional, IsString, Matches, Max, Min, ValidationArguments } from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX } from '../constants/regex-list';
import { DbLookup } from '../pipes/db-lookup.pipe';
import { BeginEndHourFlag } from '../entities/begin-end-hour-flag.entity';
import { FindOneOptions } from 'typeorm';

export class HourlyGasFlowMeterBaseDTO {
  @IsString()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  componentId: string;

  @IsOptional()
  @IsString()
  @DbLookup(
    BeginEndHourFlag,
    (args: ValidationArguments): FindOneOptions<BeginEndHourFlag> => {
      return { where: { id: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} has an invalid value of ${args.value}`;
      },
    },
  )
  beginEndHourFlag?: string;

  @IsOptional()
  @IsNumber()
  @Min(-9999999999.99)
  @Max(9999999999.99)
  hourlyGFMReading?: number;

  @IsOptional()
  @IsNumber()
  @Min(-9999999999.99)
  @Max(9999999999.99)
  averageHourlySamplingRate?: number;

  @IsOptional()
  @IsString()
  samplingRateUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.9)
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
